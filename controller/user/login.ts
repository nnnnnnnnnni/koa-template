import { Context } from "koa";

export default async (ctx: Context) => {
  console.log('login')
  return ctx.body = ''
}