// nestjs
import { PrismaService } from 'nestjs-prisma';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

// services
import { AuthService } from './../auth.service';

// config
import { ENV } from '@config/env';

// third party
import { ExtractJwt, Strategy } from 'passport-jwt';

// utils
import { extractTokenFromCookies, extractTokenFromHeader } from '../utils';

// types
import type { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => extractTokenFromCookies(request, ENV.APP_ACCESS_TOKEN),
        (request) => extractTokenFromHeader(request, ENV.APP_HEADER_ACCESS),
      ]),
      ignoreExpiration: false,
      secretOrKey: ENV.APP_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: { id: string; orgId: string }) {
    const session = await this.prisma.sessions.findFirst({
      where: {
        id: extractTokenFromCookies(
          request,
          this.config.get('APP_SESSION_COOKIE'),
        ),
      },
    });

    if (!session) {
      await this.authService.logoutRequest(request);
      throw new UnauthorizedException('Session Not Found! Try Login');
    }

    const profile = await this.prisma.profile.findUnique({
      where: { id: payload.id },
      include: { organization: true },
    });

    if (!profile) {
      await this.authService.logoutRequest(request);
      throw new UnauthorizedException('User Not Found!');
    }

    return {
      profile,
      organization: profile.organization,
      session,
    };
  }
}
