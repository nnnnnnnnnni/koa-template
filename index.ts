import Koa from "koa";
import { config } from "./config";
import { IConfig } from "./interface/config";
import { IRoute } from "./interface/route";
import CRouter from "./router/index";
import koaBody from "koa-body";
import koaStaic from "koa-static";
import cors from "koa2-cors";
import Router from "koa-router";
import mongoose from "mongoose";
// import validation from 'koa2-validation'
const allRouter = new CRouter();
const koaRouter = new Router();

export default class App {
  public app: Koa;
  private config: IConfig;
  constructor(config: IConfig) {
    this.app = new Koa();
    this.config = config;
    this.initializeMiddlewares();
    this.initializeRoutes(allRouter.getAllRoutes());
    this.dbConnect();
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
        throw new Error(
          `Invalid Restful request: [methds: ${route.methods} path: ${route.path}]`
        );
      }
    });
    this.app.use(koaRouter.routes()).use(koaRouter.allowedMethods());
  }

  private dbConnect() {
    mongoose
      .connect(
        `mongodb://${this.config.mongo.host}:${this.config.mongo.port}/${this.config.mongo.name}`,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
        }
      )
      .then(() => {
        console.log(
          `mongodb://${this.config.mongo.host}:${this.config.mongo.port}/${this.config.mongo.name} 已连接`
        );
      })
      .catch((err) => {
        console.log("mongoose连接异常", err);
      });
    mongoose.connection.on("disconnected", () => {
      console.log("数据库已经断开连接");
    });
  }

  private errorHandler() {
    this.app.use(() => {});
  }

  public start(cb?: Function) {
    this.app.listen(this.config.prot, () => {
      console.log(`app start at port: ${this.config.prot}`);
      if (cb != undefined) cb();
    });
  }
}

const Server = new App(config);
Server.start();
