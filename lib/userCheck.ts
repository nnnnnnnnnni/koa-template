import { Context, Next } from "koa";
import jwt from "./jwt";
import Utils from "./utils";
const Response = Utils.generateResponse;
import {config} from '../config'

/**
 * 验证jwt有效性
 * @param ctx
 * @param next
 * @returns
 */
export const checkAuth = async (ctx: Context, next: Next) => {
  const token = ctx.request.header["authorization"] || ctx.cookies.get(config.jwt.name);
  let msg = "";
  if (!token) {
    ctx.status = 403;
    msg = "Need Login";
  } else if (!jwt.verify(token)) {
    ctx.status = 400;
    msg = "Invalid Token";
  } else {
    ctx.status = 200;
    return applyUser(ctx, next)
  }
  if (msg != "") {
    ctx.user = null;
    return ctx.body = Response(0, msg);
  }
};

export const applyUser = async(ctx: Context, next: Next) => {
  const token = ctx.request.header["authorization"] || ctx.cookies.get(config.jwt.name);
  if(token) {
    const [_, payload, __] = token.split(".");
    ctx.user = JSON.parse(Buffer.from(payload, "base64").toString("utf8"));
  } else {
    ctx.user = null;
  }
  return next();
}