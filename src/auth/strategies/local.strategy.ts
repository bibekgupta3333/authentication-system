// nest
import { PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  HttpException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

// third-party
import { Strategy } from 'passport-local';
import { validate } from 'class-validator';

// services
import { ProfileService } from '@src/profile/profile.service';

// dto
import { RegisterWithEmailDto } from '../dto';

// utils
import { extractClassValidatorErrorMessages } from '@src/common/utils';
import { checkPassword } from '../utils';

// types
import { Request } from 'express';

async function handleLoginError(req: Request) {
  const dto = new RegisterWithEmailDto();
  Object.assign(dto, req.body);

  const errors = await validate(dto);

  if (errors.length)
    throw new BadRequestException(extractClassValidatorErrorMessages(errors));
}

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly profileService: ProfileService) {
    super({
      usernameField: 'email',
    });
  }

  async authenticate(req: Request) {
    try {
      // handle error and validation
      // NOTE: There might be a better way than to do this.
      await handleLoginError(req);

      const { email, password } = req.body;

      const profile = await this.profileService.findOneWithEmail(email);

      if (!profile || !checkPassword(password, profile.password))
        throw new NotFoundException('User not found!');

      this.success({
        profile,
        organization: null,
        session: null,
      });
    } catch (error) {
      // basic http exception that can be handled by nest
      if (error instanceof HttpException) {
        this.error(error);
      }
    }
  }
}
