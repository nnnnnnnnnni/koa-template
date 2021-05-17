import { Context } from "koa";
import { IUser } from "mongo/models";
import Utils from "../../lib/utils";
import crypto from 'crypto';
import userModel from '../../mongo/userSchema'

export default async (ctx: Context) => {
  const { email, phone, password } = ctx.request.body;
  const secret = Utils.randomString()
  const registerUser: IUser = {
    secret: secret,
    password: crypto.createHmac("sha512", password).update(secret).digest("hex")
  }
  if(email && Utils.isEmail(email)) {
    registerUser.email = email;
  } else if(phone && Utils.isPhone(phone)) {
    registerUser.phone = phone
  }
  const data = await userModel.findOne({_id: ''})
  console.log(data)
  console.log(registerUser);
};
