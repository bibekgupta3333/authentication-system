//  nest
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, UseGuards } from '@nestjs/common';

// guards
import { JwtAuthGuard } from './auth/guards';

// decorators
import { AuthContext } from './common/decorators';

// entity
import { UserInititializationResponse } from './app.entity';
import { ProfileEntity } from './profile/entities/profile.entity';

@Controller('')
@ApiTags('Core')
export class AppController {
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
}
