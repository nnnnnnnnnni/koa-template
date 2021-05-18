import { IRoute } from "../interface/route";
import test from "../controller/test/test";

export default [
  {
    path: "/test",
    methods: "GET",
    Middlewares: [test],
    needLogin: false,
    threshold: 5
  },
] as IRoute[];
