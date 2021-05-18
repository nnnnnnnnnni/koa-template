import { IRoute } from "../interface/route";
import Logger from "../logs";
import UserRoutes from "./userRoutes";
import testRoutes from "./testRoutes";
import { Context, Next } from "koa";
import fs from "fs";
import path from "path";
import { IMiddleware } from "koa-router";
import checkAuth from "../lib/checkAuth";
import Redis from "../redis/index";
import Utils from "../lib/utils";
const Response = Utils.generateResponse;
export default class Routes {
  allRoute: IRoute[] = [];
  routeSet = new Set<string>();
  constructor() {
    this.addRoutes(UserRoutes);
    this.addRoutes(testRoutes);
    this.addRoute({
      path: RegExp("/*"),
      methods: "GET",
      needLogin: false,
      Middlewares: [this.sendHtml],
    });
  }
  addRoutes(routes: IRoute[]) {
    for (const route of routes) {
      const routeKey = `${route.methods}:${route.path}`;
      if (this.routeSet.has(routeKey)) {
        Logger.log("APP", `Repeat Route: ${JSON.stringify(route)}`, "info");
      } else {
        this.routeSet.add(routeKey);
      }
      // 注册接口频率限制
      if (route.threshold) {
        if (typeof route.threshold == "number") {
          route.Middlewares.unshift(this.setThreshold(route));
        } else {
          route.Middlewares.unshift(route.threshold.operation);
        }
      }
      // 注册权限验证
      if (route.needLogin) {
        route.Middlewares.unshift(checkAuth);
      }
      if (route.Middlewares.length == 0) {
        Logger.log("APP", `Invalid Middleware Function: [methds: ${route.methods} path: ${route.path}]`, "info");
      }
      this.allRoute.push(route);
    }
  }
  sendHtml(ctx: Context) {
    ctx.header["content-type"] = "text/html; charset=utf-8";
    ctx.type = "text/html; charset=utf-8";
    return (ctx.body = fs.createReadStream(path.resolve(__dirname, "../public/index.html")));
  }
  addRoute(route: IRoute) {
    this.allRoute.push(route);
  }
  getAllRoutes(): IRoute[] {
    const routes: IRoute[] = this.allRoute;
    return routes;
  }
  setThreshold(route: IRoute): IMiddleware<any, Context> {
    const times = route.threshold as number;
    return async (ctx: Context, next: Next) => {
      const { url, method, ip } = ctx.request;
      const key = `${ip}-${method}-${url}-`;
      const _times = await Redis.keys(1, `${key}*`);
      if (Number(_times.length) >= times) {
        ctx.status = 429;
        return (ctx.body = Response(0, "接口请求频繁"));
      } else {
        Redis.set(1, `${key}-${new Date().getTime()}`, new Date().getTime().toString(), 'EX', 60);
        return next();
      }
    };
  }
}
