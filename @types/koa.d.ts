import { IResponse } from "interface/response";
import { IUser } from "mongo/models";
import fs from 'fs';
import { Redis } from "ioredis";
import { Session } from "koa-session";

declare module 'Koa' {

  interface session extends Session {
    user: IUser | null;
  }
  interface Context extends DefaultContext {
    user?: IUser | null;
    redis: Redis
    body: IResponse | fs.ReadStream;
    session: session
  }
}