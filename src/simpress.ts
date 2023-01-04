import type { RequestListener as HttpRequestListener } from 'http';

import { Route } from './route';
import { Router } from './router';
import type {
  RawRequest,
  Request,
  Response,
  Middleware,
  ErrorMiddleware,
  RequestListener
} from './types';

/**
 * This class provides a simple http framework.
 */
export class Simpress {
  public readonly middlewares: Middleware[];
  public readonly errMiddlewares: ErrorMiddleware[];
  private _routers: Router[];

  constructor() {
    this.middlewares = [];
    this.errMiddlewares = [];
    this._routers = [new Router()];
  }

  /**
   * Appends a new middleware.
   */
  use(middleware: Middleware): Simpress {
    if (!this.middlewares.includes(middleware)) {
      this.middlewares.push(middleware);
    }

    return this;
  }

  /**
   * Appends a new middleware which handles errors from other middlewares.
   */
  useForError(middleware: ErrorMiddleware): Simpress {
    if (!this.errMiddlewares.includes(middleware)) {
      this.errMiddlewares.push(middleware);
    }

    return this;
  }

  /**
   * Appends a router to the instance.
   */
  useRouter(router: Router): Simpress {
    if (!this._routers.includes(router)) {
      this._routers.push(router);
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

    this._routers[0].routes.set(method + '|' + path.source, route);

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

    for (const router of this._routers) {
      const route = router.routes.get(method + '|' + path.source);

      if (route) return route;
    }

    return null;
  }

  /**
   * Converts the instance to an @see http.RequestListener .
   */
  toListener(): HttpRequestListener {
    return async (req: RawRequest & { pathRegex?: RegExp }, res: Response) => {
      for (const router of this._routers) {
        for (const [_, route] of router.routes) {
          // check path and method
          if (route.path.test(req.url ?? '') && req.method === route.method) {
            req.pathRegex = route.path;

            for (const level of [this, router, route]) {
              for (const middleware of level.middlewares) {
                let err = await new Promise(resolve =>
                  middleware(req as Request, res, resolve)
                );

                if (err !== undefined) {
                  for (const errMiddleware of level.errMiddlewares) {
                    err = await new Promise(resolve =>
                      errMiddleware(err, req as Request, res, resolve)
                    );

                    if (err === undefined) return;
                  }

                  return;
                }
              }
            }

            route.listener(req as Request, res);

            return;
          }
        }
      }

      res.writeHead(404);
      res.end();
    };
  }
}
