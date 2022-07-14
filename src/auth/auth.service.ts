// nest
import { PrismaService } from 'nestjs-prisma';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, Injectable } from '@nestjs/common';

// third-party
import { Request } from 'express';
import { addDays } from 'date-fns';

// dto
import {
  ResetPasswordDto,
  RegisterWithEmailDto,
  InitiateResetPasswordDto,
} from './dto';

// services
import { AuthJwtService } from './jwt.service';
import { ProfileService } from '@src/profile/profile.service';

// utils
import { hashPassword } from './utils';
import { generateCuids } from '@src/common/utils';
import { MailService } from '@src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly mailService: MailService,
    private readonly jwtService: AuthJwtService,
    private readonly profileService: ProfileService,
  ) {}

  async register({ email, password }: RegisterWithEmailDto) {
    const [profileId] = generateCuids(1);

    const user = await this.profileService.findOneWithEmail(email);
    if (user) throw new BadRequestException('User Already Exists');

    const profile = await this.prisma.profile.create({
      data: {
        id: profileId,
        email,
        password: hashPassword(password),
        firstName: `auth-user-${profileId}`,
        lastName: '',
        isActive: true,
        isEmailSet: true,
        isFirstPasswordSet: true,
        isEmailVerified: true,
      },
    });

    return profile;
  }

  async registerWithEmail({ email, password }: RegisterWithEmailDto) {
    const profile = await this.register({ email, password });
    return profile;
  }

  async authenticateRequest(request: Request, profile: TProfile) {
    const { res } = request;
    const [sessionId] = generateCuids(1);

    const [accessToken, refreshToken] = this.jwtService.generateTokensForAuth(
      profile,
      { sessionId },
    );

    await this.prisma.sessions.create({
      data: {
        id: sessionId,
        sessionData: {
          accessToken,
          refreshToken,
        },
        expiredAt: new Date(),
        profileId: profile.id,
      },
    });

    // loading session, accessToken and refreshToken within cookies
    res.cookie(this.config.get('APP_SESSION_COOKIE'), sessionId, {
      httpOnly: true,
      expires: addDays(new Date(), this.config.get('JWT.ACCESS_EXPIRES')),
    });

    res.cookie(this.config.get('APP_ACCESS_TOKEN'), accessToken, {
      httpOnly: true,
      expires: addDays(new Date(), this.config.get('JWT.ACCESS_EXPIRES')),
    });
    res.cookie(this.config.get('APP_REFRESH_TOKEN'), refreshToken, {
      httpOnly: true,
      expires: addDays(new Date(), this.config.get('JWT.REFRESH_EXPIRES')),
    });

    return { tokens: { accessToken, refreshToken } };
  }

  async initiateResetPassword({ email }: InitiateResetPasswordDto) {
    const profile = await this.profileService.findOneWithEmail(email);
    if (!profile) throw new BadRequestException('User Not Found');

    const resetToken = this.jwtService.generateResetPasswordToken({
      email,
      profileId: profile.id,
    });

    // send reset email to the user
    this.mailService
      .sendResetPasswordEmail({ email, resetToken })
      // don't care if the email is sent
      .catch((error) => {
        console.error(
          `[${email}-${profile.id}]: Error sending reset password email: ${error}`,
        );
      });

    return;
  }

  async resetPassword(data: ResetPasswordDto) {
    const { password, token } = data;

    const { profileId } = this.jwtService.verify(token);

    const profile = await this.profileService.findOne(profileId);
    if (!profile) throw new BadRequestException('User Not Found');

    await this.prisma.profile.update({
      where: { id: profile.id },
      data: {
        password: hashPassword(password),
      },
    });

    return;
  }

  async verifyResetToken(token: string) {
    const { profileId } = this.jwtService.verify(token);

    const profile = await this.profileService.findOne(profileId);
    if (!profile) throw new BadRequestException('User Not Found');

    return profile;
  }

  async logoutRequest(req: Request) {
    const sessionId = req.cookies?.[this.config.get('APP_SESSION_COOKIE')];

    req.res.clearCookie(this.config.get('APP_ACCESS_TOKEN'));
    req.res.clearCookie(this.config.get('APP_REFRESH_TOKEN'));
    req.res.clearCookie(this.config.get('APP_SESSION_COOKIE'));

    if (sessionId) {
      await this.prisma.sessions.delete({ where: { id: sessionId } });
    }
  }

  async getRefreshToken(token: string) {
    console.log(this.jwtService.verify(token));
    const session = await this.prisma.sessions.findFirst({
      where: {
        sessionData: {
          path: ['refreshToken'],
          equals: token,
        },
      },
      include: { profile: true },
    });
    if (!this.jwtService.verify(token) && !session) {
      throw new BadRequestException('Invalid Token');
    }

    const [accessToken, refreshToken] = this.jwtService.generateTokensForAuth(
      session.profile,
      { sessionId: session.id },
    );

    return {
      tokens: (
        await this.prisma.sessions.update({
          where: { id: session.id },
          data: {
            sessionData: {
              accessToken,
              refreshToken,
            },
            expiredAt: new Date(),
          },
        })
      ).sessionData,
    };
  }
}
