// third-party
import { Request } from 'express';

export function extractTokenFromCookies(request: Request, cookieName: string) {
  return request.cookies?.[cookieName];
}

export function extractTokenFromHeader(request: Request, headerName: string) {
  return request?.headers?.[headerName.toLowerCase()];
}
