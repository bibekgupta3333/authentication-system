import axios from 'axios';
// nest
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';

function getTokenFromGhRespone(response: string) {
  return response
    .split('&')
    .filter((item) => item.includes('access_token'))[0]
    .split('=')[1];
}
async function getGhAccessToken(configService: ConfigService, token: string) {
  const ghTokenResponse = await axios.post(
    `${configService.get(
      'THIRD_PARTY.APP_GITHUB.ENDPOINT',
    )}?client_id=${configService.get(
      'THIRD_PARTY.APP_GITHUB.CLIENT_ID',
    )}&client_secret=${configService.get(
      'THIRD_PARTY.APP_GITHUB.CLIENT_SECRET',
    )}&code=${token}`,
  );

  if (!ghTokenResponse.data.includes('access_token')) {
    throw new BadRequestException('Invalid token');
  }

  return getTokenFromGhRespone(ghTokenResponse.data);
}

export async function getGhUserData(
  configService: ConfigService,
  token: string,
) {
  const ghToken = await getGhAccessToken(configService, token);

  const ghUserData = await axios.get(
    configService.get('THIRD_PARTY.APP_GITHUB.USER_DATA_ENDPOINT'),
    {
      headers: { Authorization: `token ${ghToken}` },
    },
  );

  return ghUserData.data;
}
