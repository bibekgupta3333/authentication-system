// nest
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

// service
import { AuthService } from './auth.service';
import { AuthJwtService } from './jwt.service';

// controller
import { AuthController } from './auth.controller';

// modules
import { PassportModule } from '@nestjs/passport';
import { MailModule } from './../mail/mail.module';
import { ProfileModule } from '@src/profile/profile.module';

// strategies
import {
  JwtRefreshStrategy,
  JwtStrategy,
  LocalStrategy,
  GithubStrategy,
  GitlabStrategy,
  MicrosoftStrategy,
} from './strategies';

// services
import { SocialAccountsService } from '@src/profile/social-accounts/social-account.service';

@Module({
  imports: [MailModule, ProfileModule, PassportModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthJwtService,

    // Strategies
    JwtStrategy,
    LocalStrategy,
    JwtRefreshStrategy,
    GithubStrategy,
    GitlabStrategy,
    MicrosoftStrategy,

    // services
    SocialAccountsService,
  ],
})
export class AuthModule {}
