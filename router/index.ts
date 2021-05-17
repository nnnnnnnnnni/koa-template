import { IRoute } from "../interface/route";
import Logger from "../logs";
import UserRoutes from "./userRoutes";
import testRoutes from "./testRoutes";
import { Context } from "koa";
import fs from "fs";
import path from "path";
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
}
