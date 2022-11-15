import axios from 'axios';
// nest
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';

async function getGitlabAccessToken(
  configService: ConfigService,
  token: string,
) {
  const glTokenResponse = await axios.post(
    `${configService.get(
      'THIRD_PARTY.APP_GITLAB.ENDPOINT',
    )}?client_id=${configService.get(
      'THIRD_PARTY.APP_GITLAB.CLIENT_ID',
    )}&client_secret=${configService.get(
      'THIRD_PARTY.APP_GITLAB.CLIENT_SECRET',
    )}&code=${token}&grant_type=${configService.get(
      'THIRD_PARTY.APP_GITLAB.GRANT_TYPE',
    )}&redirect_uri=${configService.get(
      'THIRD_PARTY.APP_GITLAB.REDIRECT_URI',
    )}`,
  );

  if (!('access_token' in glTokenResponse.data)) {
    throw new BadRequestException('Invalid token');
  }

  return glTokenResponse.data?.access_token;
}

export async function getGitlabUserData(
  configService: ConfigService,
  token: string,
) {
  const glToken = await getGitlabAccessToken(configService, token);

  const glUserData = await axios.get(
    configService.get('THIRD_PARTY.APP_GITLAB.USER_DATA_ENDPOINT'),
    {
      headers: { Authorization: `bearer ${glToken}` },
    },
  );

  return glUserData.data;
}
