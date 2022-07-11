// nest
import { ApiProperty } from '@nestjs/swagger';

// prisma
import { Profile } from '@prisma/client';

export class CreateProfileDto implements Partial<Profile> {
  id?: string;

  firstName: string;
  lastName: string;
  avatar?: string;
  email: string;
  // Authentication and Authorization
  password: string;

  // Configuration
  isActive?: boolean;
  isFirstPasswordSet?: boolean;
  isEmailSet?: boolean;
  isEmailVerified?: boolean;

  phoneNumber?: string;
  // organizationId: string;
}
