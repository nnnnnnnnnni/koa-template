import { Context, Next } from "koa";
import moment from "moment";
import fs from "fs";
import path from "path";
import os from "os";

type TLabel = "info" | "error" | "debug";
type TType = "MONGO" | "APP" | "REDIS";

export default class Logger {
  public static getFileName(type: TType, label: TLabel) {
    return `${type}.${label}.${moment().format("MM.DD")}`;
  }

  public static log(type: TType, msg: any, label: TLabel, isConsole: boolean = true, isWrite: boolean = true) {
    const info = `[${type}] [${label}]: ${msg}`;
    if(isConsole) {
      console.log(info)
    }
    if (isWrite) {
      const file = path.resolve(__dirname, this.getFileName(type, label));
      fs.appendFile(file, `${moment().format("MM/DD HH:mm:ss")} ` +info + os.EOL, () => {});
    }
  }

  public static async infoLog(ctx: Context, next: Next) {
    const start = new Date().getTime();
    await next();
    const end = new Date().getTime() - start;
    Logger.log("APP", `${moment().format("MM/DD HH:mm:ss")} ${ctx.ip} ${ctx.method} ${ctx.url} -- [${ctx.response.status}] ${end} ms`, "info");
  }
}
