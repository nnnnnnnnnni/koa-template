import crypto from "crypto";
import { TCode, IResponse } from "interface/response";

export default class Utils {
  public static isEmail(mail: string) {
    return /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/.test(mail);
  }
  public static isPhone(phone: string) {
    return /\d{3}-\d{8}|\d{4}-\{7,8}/.test(phone);
  }

  public static randomChar(): string {
    const chars = "123456780ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz123456780";
    const length = chars.length;
    return chars[Number((Math.random() * (length - 1)).toFixed())];
  }

  public static randomString(len = 16) {
    return crypto
      .randomBytes(len || 32)
      .toString("base64")
      .replace(new RegExp("[`~%!@#^+-=''?~！@#￥……&——‘”“'？*()（），,。.、]", "g"), this.randomChar());
  }

  /**
   * 统一生成 response 的方法
   */
  public static generateResponse(code: TCode, message: string, data = {}): IResponse {
    return {
      code,
      message,
      data,
      timestamp: new Date().getTime(),
    };
  }
}
