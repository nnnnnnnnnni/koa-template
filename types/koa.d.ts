import { IUser } from "mongo/models";

declare module 'Koa' {
  interface Context extends DefaultContext {
    user?: IUser;
  }
}