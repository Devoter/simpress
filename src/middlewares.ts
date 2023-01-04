import type { IncomingMessage, ServerResponse } from 'http';
import url from 'url';
import type { ParsedUrlQuery } from 'querystring';

/**
 * Appends a JSON body parser middleware.
 */
export function applyJsonBodyParser(
  req: IncomingMessage & { body?: unknown },
  res: ServerResponse,
  next: (err?: unknown) => void
) {
  const body: Uint8Array[] = [];

  req.on('data', chunk => body.push(chunk));
  req.on('end', () => {
    if (body.length) {
      try {
        req.body = JSON.parse(Buffer.concat(body).toString());
      } catch (e) {
        // pass
      }
    }

    next();
  });
}

/**
 * Appends a query params parser middleware.
 */
export function applyQueryParamsParser(
  req: IncomingMessage & { queryParams?: ParsedUrlQuery },
  res: ServerResponse,
  next: (err?: unknown) => void
) {
  req.queryParams = url.parse(req.url ?? '', true).query;
  next();
}

/**
 * Appends a path params parser middleware.
 */
export function applyPathParamsParser(
  req: IncomingMessage & {
    pathRegex: RegExp;
    pathParams?: Record<string, string> | null;
  },
  res: ServerResponse,
  next: (err?: unknown) => void
) {
  const matches = req.url?.match(req.pathRegex);

  req.pathParams = matches && matches.groups ? matches.groups : null;
  next();
}

/**
 * Appends a request console logger middleware.
 */
export function applyRequestConsoleLogger(
  req: IncomingMessage & {
    pathParams?: Record<string, string> | null;
    queryParams?: ParsedUrlQuery;
    body?: unknown;
  },
  res: ServerResponse,
  next: (err?: unknown) => void
) {
  console.log(
    new Date(),
    req.method,
    req.url,
    'path params:',
    req.pathParams,
    'query params:',
    req.queryParams,
    'body:',
    req.body
  );

  next();
}
