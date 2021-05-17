import Koa, { Context } from "koa";
import { config } from "./config";
import { IConfig } from "./interface/config";
import { IRoute } from "./interface/route";
import CRouter from "./router/index";
import koaBody from "koa-body";
import koaStaic from "koa-static";
import cors from "koa2-cors";
import Router from "koa-router";
import mongoose from "mongoose";
import Logger from "./logs";
import checkAuth from "./lib/checkAuth";
const allRouter = new CRouter();
const koaRouter = new Router();

export default class App {
  public app: Koa<{}, Context>;
  private config: IConfig;
  constructor(config: IConfig) {
    this.app = new Koa<{}, Context>();
    this.config = config;
    this.initializeMiddlewares();
    this.dbConnect();
    this.initializeRoutes(allRouter.getAllRoutes());
    this.errorHandler();
  }

  private initializeMiddlewares() {
    // 日志中间件
    this.app.use(Logger.infoLog);
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
    routes.map((route) => {
      let _middilewares = route.Middlewares;
      if (route.needLogin) {
        _middilewares.unshift(checkAuth);
      }
      if (route.methods == "GET") {
        koaRouter.get(route.path, ..._middilewares);
      } else if (route.methods == "POST") {
        koaRouter.post(route.path, ..._middilewares);
      } else if (route.methods == "PUT") {
        koaRouter.put(route.path, ..._middilewares);
      } else if (route.methods == "DELETE") {
        koaRouter.delete(route.path, ..._middilewares);
      } else {
        Logger.log("APP", `Invalid Restful Request: [methds: ${route.methods} path: ${route.path}]`, "info");
      }
    });
    this.app.use(koaRouter.routes()).use(koaRouter.allowedMethods());
  }

  private dbConnect() {
    mongoose
      .connect(`mongodb://${this.config.mongo.host}:${this.config.mongo.port}/${this.config.mongo.name}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      })
      .then(() => {
        Logger.log("MONGO", `mongodb://${this.config.mongo.host}:${this.config.mongo.port}/${this.config.mongo.name} 已连接`, "info", false);
      })
      .catch((err) => {
        Logger.log("MONGO", `mongoose连接异常: ${err}`, "error");
      });
    mongoose.connection.on("disconnected", () => {
      Logger.log("MONGO", `数据库已经断开连接`, "info");
    });
  }

  private errorHandler() {
    this.app.on("error", (err: Error) => {
      Logger.log("APP", err.stack, "error");
    });
  }

  public start(cb?: Function) {
    this.app.listen(this.config.prot, () => {
      Logger.log("APP", `app start at port: ${this.config.prot}`, "info", false);
      if (cb != undefined) cb();
    });
  }
}

const Server = new App(config);
Server.start();
