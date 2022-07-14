// third-party
import {
  IsJWT,
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ResetPasswordDto {
  @IsJWT()
  token: string;

  @IsString()
  @MinLength(8)
  @MaxLength(255)
  password: string;
}

export class InitiateResetPasswordDto {
  @IsEmail()
  email: string;
}
