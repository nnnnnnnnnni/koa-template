import { IRoute } from "../interface/route";
import Logger from "../logs";
import UserRoutes from "./userRoutes";
import testRoutes from "./testRoutes";
import { Context, Next } from "koa";
import { IMiddleware } from "koa-router";
import { checkJwtAuth, applyNoUser, checkCookieAuth } from "../lib/userCheck";
import Redis from "../redis/index";
import Utils from "../lib/utils";
import { IValidation, IValidationField } from "interface/validation";
import { config } from "../config";
const Response = Utils.generateResponse;

/**
 * 400  接口错误
 * 429  接口请求频繁
 * 403  token无效
 * 404  接口不存在
 * 405  method not allow
 */
export default class Routes {
  allRoute: IRoute[] = [];
  routeSet = new Set<string>();
  constructor() {
    this.addRoutes(UserRoutes);
    this.addRoutes(testRoutes);
  }
  addRoutes(routes: IRoute[]) {
    for (const route of routes) {
      const routeKey = `${route.methods}:${route.path}`;
      if (this.routeSet.has(routeKey)) {
        Logger.log("APP", `Repeat Route: ${JSON.stringify(route)}`, "info");
      } else {
        this.routeSet.add(routeKey);
      }
      // 注册 接口频率限制
      if (route.threshold) {
        if(!config.redis) {
          Logger.log('APP', `Invaild Redis Config With Route's Threshlod [methds: ${route.methods} path: ${route.path}]`, 'error');
        }
        if (typeof route.threshold == "number") {
          route.Middlewares.unshift(this.setThreshold(route.threshold));
        } else {
          route.Middlewares.unshift(route.threshold.operation);
        }
      }
      // 注册 权限验证
      if (route.needLogin) {
        if(config.jwtOrSession.authFunc == 'cookie') {
          route.Middlewares.unshift(checkCookieAuth);
        } else if(config.jwtOrSession.authFunc == 'jwt') {
          route.Middlewares.unshift(checkJwtAuth);
        }
      } else {
        route.Middlewares.unshift(applyNoUser);
      }
      // 注册 接口字段判断
      if (route.validation) {
        route.Middlewares.unshift(this.setValidation(route.validation));
      }
      if (route.Middlewares.length == 0) {
        Logger.log("APP", `Invalid Middleware Function: [methds: ${route.methods} path: ${route.path}]`, "info");
      }
      this.allRoute.push(route);
    }
  }
  addRoute(route: IRoute) {
    this.allRoute.push(route);
  }
  getAllRoutes(): IRoute[] {
    const routes: IRoute[] = this.allRoute;
    return routes;
  }
  setThreshold(times: number): IMiddleware<any, Context> {
    return async (ctx: Context, next: Next) => {
      const { url, method, ip } = ctx.request;
      const key = `${ip}-${method}-${url}-`;
      const _times = await Redis.keys(1, `${key}*`);
      if (Number(_times.length) >= times) {
        ctx.status = 429;
        return (ctx.body = Response(0, "接口请求频繁"));
      } else {
        Redis.set(1, `${key}-${new Date().getTime()}`, new Date().getTime().toString(), "EX", 60);
        return next();
      }
    };
  }

  setValidation(validation: IValidation): IMiddleware<any, Context> {
    return async (ctx: Context, next: Next) => {
      let validationData: IValidationField
      let requestData: any
      if(validation.body) {
        validationData = validation.body
        requestData = ctx.request.body;
      } else if(validation.params) {
        validationData = validation.params
        requestData = ctx.params
      } else {
        validationData = validation.query as IValidationField
        requestData = ctx.query
      }
      const lenvalidationFields = Object.keys(validationData);
      for(let i = 0;i <lenvalidationFields.length; i++) {
        const field = lenvalidationFields[i];
        const validation = validationData[field].validate(requestData[field]);
        if(validation.error) {
          ctx.status = 400
          return ctx.body = Response(0, validation.error.message.replace('\"value\"', `'${field}'`))
        } else {
          continue;
        }
      }
      return next();
    };
  }
}
