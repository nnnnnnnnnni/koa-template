import { Context } from "koa";
import Utils from "../../lib/utils";
const Response = Utils.generateResponse;

export default async (ctx: Context) => {
  return (ctx.body = Response(1, `TEST TIME: ${new Date()}`));
};
