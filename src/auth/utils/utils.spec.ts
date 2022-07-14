import { extractTokenFromCookies, extractTokenFromHeader } from './extractors';
import { checkPassword, hashPassword } from './password';

import type { Request } from 'express';

describe('Request token extractors', () => {
  it('can extract cookie value from request', () => {
    const cookieName = 'token';
    const cookieValue = '12345';
    const request = {
      cookies: {
        [cookieName]: cookieValue,
      },
    } as unknown as Request;

    expect(extractTokenFromCookies(request, cookieName)).toBe(cookieValue);
  });

  it('can extract header value from request', () => {
    const headerName = 'Authorization';
    const headerValue = 'Bearer 12345';
    const request = {
      headers: {
        [headerName.toLowerCase()]: headerValue,
      },
    } as unknown as Request;

    expect(extractTokenFromHeader(request, headerName)).toBe(headerValue);
  });
});

describe('Password hashing', () => {
  it('can properly hash password and compare hashed passwords', () => {
    const password = 'password';
    const hashedPassword = hashPassword(password);
    expect(checkPassword(password, hashedPassword)).toBe(true);
  });

  it('can only match the exact password', () => {
    const password = 'password';
    const hashedPassword = hashPassword(password);
    expect(checkPassword('different-password', hashedPassword)).toBe(false);
  });
});
