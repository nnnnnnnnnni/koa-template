import { Context, Next } from "koa";

export const check = async (ctx: Context, next: Next) => {
  if (!ctx.request.query.name) {
    console.log(1);
    next();
  } else {
    console.log(2);
    ctx.body = "no"
  }
};
