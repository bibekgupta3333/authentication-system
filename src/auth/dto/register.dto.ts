// third-party
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

// nest
import { ApiProperty } from '@nestjs/swagger';

export class RegisterWithEmailDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(255)
  password: string;
}
