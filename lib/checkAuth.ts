import { Context, Next } from "koa";
import jwt from "../lib/jwt";

/**
 * 验证jwt有效性
 * @param ctx
 * @param next
 * @returns
 */
export default async (ctx: Context, next: Next) => {
  const token = ctx.request.header["authorization"] || ctx.cookies.get('token');
  let msg = "";
  if (!token) {
    ctx.status = 403;
    msg = "Need Login";
  } else if (!jwt.verify(token)) {
    ctx.status = 400;
    msg = "Invalid Token";
  } else {
    ctx.status = 200;
    const [_, payload, __] = token.split(".");
    ctx.user = JSON.parse(Buffer.from(payload, 'base64').toString("utf8"));
    return next();
  }
  if (msg != "") {
    return (ctx.body = {
      code: 0,
      msg: msg,
      data: {},
    });
  }
  
};
