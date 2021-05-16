import { Context, Next } from "koa";
import moment from "moment";
import fs from "fs";
import path from "path";
import os from "os";

type TLabel = "info" | "error" | "debug";
type TType = "MONGO" | "APP" | "REDIS";

export default class Logger {
  public static log(type: TType, msg: string, label: TLabel, isWrite: boolean = true) {
    const info = `[${type}] [${label}]: ${msg.toString()}`;
    console.log(info)
    if (isWrite) {
      const file = path.resolve(__dirname, this.getFileName(type));
      fs.appendFile(file, `${moment().format("MM/DD HH:mm:ss")} ` +info + os.EOL, () => {});
    }
  }

  public static getFileName(type: TType) {
    return `${type}.${moment().format("MM.DD")}`;
  }

  public static async infoLog(ctx: Context, next: Next) {
    const start = new Date().getTime();
    await next();
    const end = new Date().getTime() - start;
    Logger.log("APP", `${moment().format("MM/DD HH:mm:ss")} ${ctx.method} ${ctx.url} -- [${ctx.response.status}] ${end} ms`, "info");
  }
}
