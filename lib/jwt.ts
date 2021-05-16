import { config } from "../config";
import crypto from "crypto";

interface IJWTHeader {
  typ: string;
  alg: string;
  exp: number;
}

export default class JsonWebToken {
  public static secret = config.jwt.secret;
  public static alg = config.jwt.alg;

  /**
   * 生成token
   * @param payload token内非加密参数
   * @returns jwt
   */
  public static generate(payload: { [key: string]: string }) {
    const header: IJWTHeader = {
      typ: "JWT",
      alg: this.alg,
      exp: new Date().getTime() + config.jwt.time,
    };
    const signedHeader = Buffer.from(JSON.stringify(header)).toString("base64");
    const signedPayload = Buffer.from(JSON.stringify(payload)).toString("base64");
    const signature = crypto
      .createHash(this.alg)
      .update(`${signedHeader}.${signedPayload}`)
      .digest("hex")
      .toString();
    return `${signedHeader}.${signedPayload}.${signature}`;
  }

  /**
   * 验证token是否有效
   * @param token jwt
   * @returns boolean
   */
  public static verify(token: string): boolean {
    const [signedHeader, signedPayload, signature] = token.split(".");
    const _signature = crypto
      .createHash(this.alg)
      .update(`${signedHeader}.${signedPayload}`)
      .digest("hex");
    if (_signature != signature) {
      return false;
    }
    const unsignedHeader = Buffer.from(signedHeader, 'base64').toString('utf8');
    const header: IJWTHeader = JSON.parse(unsignedHeader);
    if (header.exp < new Date().getTime()) {
      return false;
    }
    return true;
  }
}
