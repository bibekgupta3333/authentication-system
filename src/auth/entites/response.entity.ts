// nest
import { ApiProperty } from '@nestjs/swagger';

// third-party
import { Expose } from 'class-transformer';

export class TokenResponse {
  @Expose()
  tokens: { accessToken: string; refreshToken: string };

  constructor() {
    Object.assign(this);
  }
}

export class ResetPasswordResponse {
  @Expose()
  message: string;

  constructor() {
    Object.assign(this);
  }
}
