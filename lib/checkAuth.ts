import { Context, Next } from "koa";
import jwt from "../lib/jwt";
import Utils from "../lib/utils";
const Response = Utils.generateResponse;

/**
 * 验证jwt有效性
 * @param {Context} ctx
 * @param {Next} next
 * @returns {Next | null}
 */
export default async (ctx: Context, next: Next) => {
  const token = ctx.request.header["authorization"] || ctx.cookies.get("token");
  let msg = "";
  if (!token) {
    ctx.status = 403;
    msg = "Need Login";
  } else if (!jwt.verify(token)) {
    ctx.status = 400;
    msg = "Invalid Token";
  } else {
    ctx.status = 200;
    return next();
  }
  if (msg != "") {
    return (ctx.body = Response(0, msg));
  }
};
