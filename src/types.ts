import type { IncomingMessage, ServerResponse } from 'http';

export type Middleware<
  Request extends typeof IncomingMessage = typeof IncomingMessage,
  Response extends typeof ServerResponse = typeof ServerResponse
> = (
  req: InstanceType<Request> & { pathRegex: RegExp },
  res: InstanceType<Response> & { req: InstanceType<Request> },
  next: (err?: unknown) => void
) => void;

export type ErrorMiddleware<
  Request extends typeof IncomingMessage = typeof IncomingMessage,
  Response extends typeof ServerResponse = typeof ServerResponse
> = (
  err: unknown,
  req: InstanceType<Request> & { pathRegex: RegExp },
  res: InstanceType<Response> & { req: InstanceType<Request> },
  next: (err?: unknown) => void
) => void;
