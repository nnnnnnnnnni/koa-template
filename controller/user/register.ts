import { Context } from "koa";

export default async (ctx: Context) => {
  const token = ctx.header["token"] || ctx.cookies.get('token')
  console.log(token)
};
