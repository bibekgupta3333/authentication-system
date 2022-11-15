import { RegisterWithGithubDto } from './auth/dto/register.dto';
import { SocialAccountsService } from './profile/social-accounts/social-account.service';
//  nest
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';

// guards
import { JwtAuthGuard } from './auth/guards';

// decorators
import { AuthContext } from './common/decorators';

// entity
import { UserInititializationResponse } from './app.entity';
import { ProfileEntity } from './profile/entities/profile.entity';

// third party
import axios from 'axios';

@Controller('')
@ApiTags('Core')
export class AppController {
  constructor(private readonly socialAccount: SocialAccountsService) {}

  @ApiResponse({
    status: 200,
    type: UserInititializationResponse,
  })
  @UseGuards(JwtAuthGuard)
  @Get('accounts/initialization')
  async initialization(@AuthContext() { profile }: TAuthContext) {
    return {
      user: new ProfileEntity(profile),
    };
  }
  @Get('user')
  async getGithub(@Query('token') token: string) {
    const registerToken = new RegisterWithGithubDto();
    registerToken.code = token;
    return await this.socialAccount.getUserFromGithub(registerToken);
  }
}
