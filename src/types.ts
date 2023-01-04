import { IncomingMessage, ServerResponse } from 'http';
import type { ParsedUrlQuery } from 'querystring';

export type RawBody = { body?: unknown };

export type QueryParams = { queryParams?: ParsedUrlQuery };

export type PathParams = { pathParams?: Record<string, string> | null };

export type RawRequest<T = IncomingMessage> = T extends IncomingMessage
  ? T
  : never;

export type Request<
  T = IncomingMessage & { pathRegex: RegExp } & RawBody &
    QueryParams &
    PathParams
> = T extends IncomingMessage & { pathRegex: RegExp } & RawBody &
  QueryParams &
  PathParams
  ? T
  : never;

export type Response<T = ServerResponse & { req: IncomingMessage }> =
  T extends ServerResponse & { req: IncomingMessage } ? T : never;

export type Middleware = (
  req: Request,
  res: Response,
  next: (err?: unknown) => void
) => void;

export type ErrorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  next: (err?: unknown) => void
) => void;

export type RequestListener = (
  req: Request,
  res: Response
) => void | Promise<void>;
