import { Context } from 'koa';
import { IMiddleware } from 'koa-router';

export type IMethod = "GET" | "POST" | "PUT" | "DELETE";

export type IRole = "user" | "admin" | "superAdmin";

export interface IRoute {
  path: string | RegExp | (string | RegExp)[];
  methods: IMethod;
  Middlewares: IMiddleware<any, Context>[],
  needLogin: boolean;
  threshold?: number | {      // 每分钟的接口请求最大数
    times: number,
    operation: IMiddleware<any, Context>
  };
}
