// nest
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable, HttpException } from '@nestjs/common';

// third party
import { Request } from 'express';
import { Strategy } from 'passport';
import { validate } from 'class-validator';

// services
import { ProfileService } from '@src/profile/profile.service';
import { SocialAccountsService } from '@src/profile/social-accounts/social-account.service';

// utils
import { extractClassValidatorErrorMessages } from '@src/common/utils';

// dto
import { RegisterWithGitlabDto } from './../dto/register.dto';

async function findAndThrowError(req: Request) {
  const dto = new RegisterWithGitlabDto();
  Object.assign(dto, req.body);

  const errors = await validate(dto);

  if (errors.length)
    throw new BadRequestException(extractClassValidatorErrorMessages(errors));
}

@Injectable()
export class GitlabStrategy extends PassportStrategy(Strategy, 'gitlab') {
  constructor(
    private readonly profileService: ProfileService,
    private readonly socialService: SocialAccountsService,
  ) {
    super();
  }

  async authenticate(req: Request) {
    try {
      // check and validate with errors
      await findAndThrowError(req);

      // request the user
      const { code } = req.body;

      const authInfo = await this.socialService.getUserFromGitlab({ code });
      const profile = await this.profileService.findForSocialAccount(
        authInfo?.uid,
        'GITLAB',
      );

      this.success(
        // user
        {
          profile,
          organization: null,
        },
        // authInfo
        authInfo,
      );
    } catch (error) {
      // basic http exception that can be handled by nest
      if (error instanceof HttpException) {
        this.error(error);
      }
      // else just fail
      this.error(new BadRequestException("'code' is invalid"));
    }
  }
}
