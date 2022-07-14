// nestjs
import { PrismaService } from 'nestjs-prisma';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

// services
import { AuthService } from './../auth.service';

// config
import { ENV } from '@config/env';

// third-party
import { ExtractJwt, Strategy } from 'passport-jwt';

// utils
import { extractTokenFromCookies, extractTokenFromHeader } from '../utils';

// types
import type { Request } from 'express';

export const JWT_REFRESH_AUTH = 'jwt-refresh-token';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  JWT_REFRESH_AUTH,
) {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => extractTokenFromCookies(request, ENV.APP_REFRESH_TOKEN),
        (request) => extractTokenFromHeader(request, ENV.APP_HEADER_REFRESH),
      ]),
      ignoreExpiration: false,
      secretOrKey: ENV.APP_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: { id: string }) {
    const profile = await this.prisma.profile.findUnique({
      where: { id: payload.id },
      include: { organization: true },
    });

    if (!profile) {
      await this.authService.logoutRequest(request);
      throw new UnauthorizedException('User Not Found!');
    }

    await this.authService.authenticateRequest(request, profile);

    return {
      profile,
      organization: profile.organization,
    };
  }
}
