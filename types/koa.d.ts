import { IResponse } from "interface/response";
import { IUser } from "mongo/models";
import fs from 'fs';
import { Redis } from "ioredis";

declare module 'Koa' {
  interface Context extends DefaultContext {
    user?: IUser | null;
    redis: Redis
    body: IResponse | fs.ReadStream;
  }
}