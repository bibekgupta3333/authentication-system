import { ENV } from '@config/env';
//  nest
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthJwtService {
  constructor(
    private readonly nestJwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateTokensForAuth(
    profile: TProfile,
    additionalPayload: Record<string, any> = {},
  ) {
    const accessToken = this.nestJwtService.sign(
      {
        id: profile.id,
        orgId: profile.organizationId,
        ...additionalPayload,
      },
      {
        secret: this.configService.get('APP_SECRET'),
        expiresIn: `${this.configService.get<number>('JWT.ACCESS_EXPIRES')}d`,
      },
    );
    const refreshToken = this.nestJwtService.sign(
      {
        __token__: accessToken,
        id: profile.id,
        orgId: profile.organizationId,
        ...additionalPayload,
      },
      {
        secret: this.configService.get('APP_SECRET'),
        expiresIn: `${this.configService.get<number>('JWT.REFRESH_EXPIRES')}d`,
      },
    );

    return [accessToken, refreshToken];
  }

  generateResetPasswordToken(payload: Record<string, any> = {}) {
    return this.nestJwtService.sign(payload, {
      secret: this.configService.get('APP_SECRET'),
      expiresIn: this.configService.get<string>(
        'JWT.RESET_PASSWORD_EXPIRATION',
      ),
    });
  }

  verify(token: string) {
    return this.nestJwtService.verify(token, {
      secret: this.configService.get('APP_SECRET'),
      ignoreExpiration: false,
    });
  }
}
