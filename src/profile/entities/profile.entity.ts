// nest
import { ApiProperty } from '@nestjs/swagger';

// third-party
import { Expose } from 'class-transformer';

// prisma
import { Profile } from '@prisma/client';

export class ProfileEntity implements Partial<Profile> {
  @Expose()
  id: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  avatar: string | null;

  @Expose()
  email: string;

  @Expose()
  isActive: boolean | null;

  @Expose()
  isFirstPasswordSet: boolean | null;

  @Expose()
  isEmailSet: boolean | null;

  @Expose()
  isEmailVerified: boolean | null;

  @Expose()
  phoneNumber: string | null;

  @Expose()
  name: string | null;

  constructor(profile: Partial<Profile>) {
    Object.assign(this, {
      ...profile,
      name: `${profile.firstName} ${profile.lastName}`.trim(),
    });
  }
}

export class ReadOnlyProfileEntity implements Partial<Profile> {
  @Expose()
  email: string;

  @Expose()
  isActive: boolean | null;

  constructor(profile: Partial<Profile>) {
    Object.assign(this, profile);
  }
}
