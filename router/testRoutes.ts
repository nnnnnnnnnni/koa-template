import { IRoute } from "../interface/route";
import test from "../controller/test/test";
import testValidation from '../validation/test'

export default [
  {
    path: "/test",
    methods: "GET",
    validation: testValidation.test,
    Middlewares: [test],
    needLogin: false,
    threshold: 5
  },
] as IRoute[];
