import { Context } from "koa";

export default async (ctx: Context) => {
  console.log(new Date())
  return ctx.body = `TEST TIME: ${new Date()}`
}