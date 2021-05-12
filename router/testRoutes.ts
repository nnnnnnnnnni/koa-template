import { IRoute } from "../interface/route";
import test from "../controller/test/test";
import { check } from "../validation/test";

export default [
  {
    path: "/test",
    methods: "GET",
    Middlewares: [check, test],
  },
] as IRoute[];
