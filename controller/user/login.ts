import { Context } from "koa";
import Utils from "../../lib/utils";
const Response = Utils.generateResponse;

export default async (ctx: Context) => {
  console.log('login')
  return ctx.body = Response(1, '登录成功')
}