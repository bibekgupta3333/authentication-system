// nest
import { Module } from '@nestjs/common';

// service
import { ProfileService } from './profile.service';

// controller
import { ProfileController } from './profile.controller';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
