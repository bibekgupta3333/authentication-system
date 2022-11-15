import axios from 'axios';
import FormData from 'form-data';
// nest
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';

async function getMicrosoftAccessToken(
  configService: ConfigService,
  token: string,
) {
  // [NOTE]: Microsoft API Token Request Enforce to use POST method
  // with x-www-form-urlencoded

  const params = new URLSearchParams();

  params.append('code', token);
  params.append(
    'client_id',
    configService.get('THIRD_PARTY.APP_MICROSOFT.CLIENT_ID'),
  );
  params.append(
    'redirect_uri',
    configService.get('THIRD_PARTY.APP_MICROSOFT.REDIRECT_URI'),
  );
  params.append(
    'grant_type',
    configService.get('THIRD_PARTY.APP_MICROSOFT.GRANT_TYPE'),
  );
  params.append(
    'client_secret',
    configService.get('THIRD_PARTY.APP_MICROSOFT.CLIENT_SECRET'),
  );
  params.append('scope', configService.get('THIRD_PARTY.APP_MICROSOFT.SCOPE'));

  const msTokenResponse = await axios.post(
    configService.get('THIRD_PARTY.APP_MICROSOFT.ENDPOINT'),
    params,
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    },
  );

  if (!('access_token' in msTokenResponse.data)) {
    throw new BadRequestException('Invalid token');
  }

  return msTokenResponse.data?.access_token;
}

export async function getMicrosoftUserData(
  configService: ConfigService,
  token: string,
) {
  const msToken = await getMicrosoftAccessToken(configService, token);

  const msUserData = await axios.get(
    configService.get('THIRD_PARTY.APP_MICROSOFT.USER_DATA_ENDPOINT'),
    {
      headers: { Authorization: `bearer ${msToken}` },
    },
  );

  return msUserData.data;
}
