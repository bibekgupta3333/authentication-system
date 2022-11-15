// third-party
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

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

export class RegisterWithGithubDto {
  @MaxLength(2000)
  code: string;
}

export class RegisterWithGitlabDto {
  @MaxLength(2000)
  code: string;
}

export class RegisterWithMicrosoftDto {
  @MaxLength(2000)
  code: string;
}
