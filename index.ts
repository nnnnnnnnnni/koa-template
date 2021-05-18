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
import redis from "ioredis";
import Logger from "./logs";
import { Redis } from "ioredis";
const allRouter = new CRouter();
const koaRouter = new Router<any, Context>();

export default class App {
  public app: Koa<{}, Context>;
  public redisClient: Redis;
  private config: IConfig;
  constructor(config: IConfig) {
    this.app = new Koa<{}, Context>();
    this.config = config;
    if (this.config.redis) {
      this.redisClient = this.redisConnect();
    }
    this.dbConnect();
    this.initializeMiddlewares();
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
      if (route.methods == "GET") {
        koaRouter.get(route.path, ...route.Middlewares);
      } else if (route.methods == "POST") {
        koaRouter.post(route.path, ...route.Middlewares);
      } else if (route.methods == "PUT") {
        koaRouter.put(route.path, ...route.Middlewares);
      } else if (route.methods == "DELETE") {
        koaRouter.delete(route.path, ...route.Middlewares);
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

  private redisConnect() {
    const redisConnect = new redis(this.config.redis);
    redisConnect.connect(() => {
      this.app.context.redis = redisConnect;
      Logger.log("REDIS", `redis://${this.config.redis?.host}:${this.config.redis?.port} 已连接`, "info", false);
    });
    redisConnect.monitor().then((monitor) => {
      monitor.on("monitor", (time, args, source, database) => {
        console.log(time, args, source, database);
      });
    });
    return redisConnect;
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

export const Server = new App(config);
Server.start();
