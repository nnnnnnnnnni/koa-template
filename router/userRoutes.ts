import { IRoute } from "../interface/route";
import Login from '../controller/user/login'

export default [
  {
    path: '/login',
    methods: 'POST',
    Middlewares: [Login]
  }
] as IRoute[]