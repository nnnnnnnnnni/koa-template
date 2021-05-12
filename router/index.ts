import { IRoute } from "../interface/route";
import UserRoutes from "./userRoutes";
import testRoutes from "./testRoutes";
// add route in constructor
export default class Routes {
  allRoute: IRoute[] = [];

  constructor() {
    this.addRoutes(UserRoutes);
    this.addRoutes(testRoutes);
  }
  addRoutes(routes: IRoute[]) {
    for (const route of routes) {
      this.allRoute.push(route);
    }
  }
  addRoute(route: IRoute) {
    this.allRoute.push(route);
  }
  getAllRoutes(): IRoute[] {
    const routes: IRoute[] = this.allRoute;
    return routes;
  }
}
