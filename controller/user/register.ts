import { Context } from "koa";
import { IUser } from "mongo/models";
import Utils from "../../lib/utils";
const Response = Utils.generateResponse;
import crypto from "crypto";
// import userModel from "../../mongo/userSchema";

export default async (ctx: Context) => {
  const { email, phone, password } = ctx.request.body;
  if (password.length < 6) {
    return (ctx.body = Response(0, "密码强度过低"));
  }
  const secret = Utils.randomString();
  const registerUser: IUser = {
    secret: secret,
    password: crypto.createHmac("sha512", password).update(secret).digest("hex"),
  };
  if (email && Utils.isEmail(email)) {
    registerUser.email = email;
  } else if (phone && Utils.isPhone(phone)) {
    registerUser.phone = phone;
  }
  return (ctx.body = Response(1, '注册成功'));
};
