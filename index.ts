import Koa from "koa";
import { config } from "./config";
import { IConfig } from "./interface/config";
import { IRoute } from "./interface/route";
import CRouter from "./router/index";
import koaBody from "koa-body";
import koaStaic from "koa-static";
import cors from "koa2-cors";
import Router from "koa-router";
const allRouter = new CRouter();
const koaRouter = new Router();

export default class App {
  public app: Koa;
  private config: IConfig;
  constructor(config: IConfig) {
    this.app = new Koa();
    this.config = config;
    this.initializeMiddlewares();
    this.dbConnect();
    this.initializeRoutes(allRouter.getAllRoutes());
    this.errorHandler();
  }

  private initializeMiddlewares() {
    // 注册 解析
    this.app.use(
      koaBody({
        multipart: true,
        formidable: {
          keepExtensions: true,
          uploadDir: this.config.localStatic,
        },
      })
    );
    // 注册静态文件地址
    this.app.use(koaStaic(this.config.localStatic));
    // 注册跨域
    this.app.use(cors());
    // 链接db
    this.dbConnect();
  }

  private initializeRoutes(routes: IRoute[]) {
    const routeSet = new Set<string>();
    routes.map((route) => {
      const routeKey = `${route.methods}:${route.path}`;
      if (routeSet.has(routeKey)) {
        console.log("路由重复: " + JSON.stringify(route));
      } else {
        routeSet.add(routeKey);
      }
      if (route.methods == "GET") {
        koaRouter.get(route.path, ...route.Middlewares);
      } else if (route.methods == "POST") {
        koaRouter.post(route.path, ...route.Middlewares);
      } else if (route.methods == "PUT") {
        koaRouter.put(route.path, ...route.Middlewares);
      } else if (route.methods == "DELETE") {
        koaRouter.delete(route.path, ...route.Middlewares);
      } else {
        throw new Error(`Invalid Restful request: [methds: ${route.methods} path: ${route.path}]`);
      }
    });
    this.app.use(koaRouter.routes()).use(koaRouter.allowedMethods());
  }

  private dbConnect() { }

  private errorHandler() {
    this.app.on('error', (err) => {
      console.log(err)
    })
  }

  public start(port?: number, cb?: Function) {
    const _port = port ?? this.config.prot;
    this.app.listen(_port, () => {
      console.log(`app start at port: ${_port}`);
      if (cb != undefined) cb();
    });
  }
}

const Server = new App(config);
Server.start();
