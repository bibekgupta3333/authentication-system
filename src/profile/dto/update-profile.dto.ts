import { PartialType } from '@nestjs/swagger';
import { CreateProfileDto } from './create-profile.dto';

export class UpdateProfileDto extends PartialType(CreateProfileDto) {
  name?: string;
  isProfileComplete: boolean;
}

export class UpdatePasswordDto {
  oldPassword: string;
  newPassword: string;
}
