import { IRoute } from "../interface/route";
import Login from "../controller/user/login";
import Register from '../controller/user/register'

export default [
  {
    path: "/login",
    methods: "POST",
    Middlewares: [Login],
    needLogin: false,
  },
  {
    path: "/register",
    methods: "POST",
    Middlewares: [Register],
    needLogin: false,
  },
] as IRoute[];
