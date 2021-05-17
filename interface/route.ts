import { IMiddleware } from 'koa-router';

export type IMethod = "GET" | "POST" | "PUT" | "DELETE";

export type IRole = "user" | "admin" | "superAdmin";

export interface IRoute {
  path: string | RegExp | (string | RegExp)[];
  methods: IMethod;
  Middlewares: IMiddleware[],
  needLogin: boolean;
}
