import type { Middleware, ErrorMiddleware, RequestListener } from './types';

export class Route {
  /**
   * Route path regular expression.
   */
  public readonly path: RegExp;

  /**
   * HTTP method.
   */
  public readonly method: string;

  /**
   * Request listener function.
   */
  public readonly listener: RequestListener;

  /**
   * Route-specified middlewares.
   */
  public readonly middlewares: Middleware[];

  /**
   * Route-specified error middlewares.
   */
  public readonly errMiddlewares: ErrorMiddleware[];

  /**
   * @param path route path
   * @param method http method
   * @param listener request listener function
   */
  constructor(path: RegExp, method: string, listener: RequestListener) {
    this.path = path;
    this.method = method;
    this.listener = listener;
    this.middlewares = [];
    this.errMiddlewares = [];
  }

  /**
   * Appends a new middleware to the route.
   */
  use(middleware: Middleware): Route {
    if (!this.middlewares.includes(middleware)) {
      this.middlewares.push(middleware);
    }

    return this;
  }

  /**
   * Appends a new middleware to the route which handles errors from other middlewares.
   */
  useForError(middleware: ErrorMiddleware): Route {
    if (!this.errMiddlewares.includes(middleware)) {
      this.errMiddlewares.push(middleware);
    }

    return this;
  }
}
