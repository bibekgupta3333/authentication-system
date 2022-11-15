// nest
import { Module } from '@nestjs/common';

// service
import { ProfileService } from './profile.service';
import { SocialAccountsService } from './social-accounts/social-account.service';

// controller
import { ProfileController } from './profile.controller';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, SocialAccountsService],
  exports: [ProfileService, SocialAccountsService],
})
export class ProfileModule {}
