import koa from 'koa'
import { IMiddleware } from 'koa-router';

export type IMethod = "GET" | "POST" | "PUT" | "DELETE" | "OPTIONS";

export type IRole = "user" | "admin" | "superAdmin";

export interface IRoute {
  path: string;
  methods: IMethod;
  Middlewares: IMiddleware[]
}