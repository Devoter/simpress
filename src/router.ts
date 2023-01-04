import { Route } from './route';
import { Middleware, ErrorMiddleware, RequestListener } from './types';

export class Router {
  public readonly routes: Map<string, Route>;
  public readonly middlewares: Middleware[];
  public readonly errMiddlewares: ErrorMiddleware[];

  constructor() {
    this.routes = new Map<string, Route>();
    this.middlewares = [];
    this.errMiddlewares = [];
  }

  /**
   * Appends a new middleware to the router.
   */
  use(middleware: Middleware): Router {
    if (!this.middlewares.includes(middleware)) {
      this.middlewares.push(middleware);
    }

    return this;
  }

  /**
   * Appends a new middleware to the router which handles errors from other middlewares.
   */
  useForError(middleware: ErrorMiddleware): Router {
    if (!this.errMiddlewares.includes(middleware)) {
      this.errMiddlewares.push(middleware);
    }

    return this;
  }

  /**
   * Appends a route.
   *
   * @param path route path
   * @param method http method
   * @param listener request listener function
   * @returns route instance
   */
  route(
    path: string | RegExp,
    method: string,
    listener: RequestListener
  ): Route {
    if (typeof path === 'string') path = new RegExp('^' + path + '\\/?$|\\?');

    const route = new Route(path, method, listener);

    this.routes.set(method + '|' + path.source, route);

    return route;
  }

  /**
   * Returns an existing route.
   *
   * @param path route path
   * @param method http method
   * @returns route instance
   */
  findRoute(path: string | RegExp, method: string): Route | null {
    if (typeof path === 'string') path = new RegExp('^' + path + '\\/?$|\\?');

    const route = this.routes.get(method + '|' + path.source);

    return route ? route : null;
  }
}
