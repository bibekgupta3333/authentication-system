// nest
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { ConfigService } from '@nestjs/config';

// dto
import { SocialAccountDto } from '@src/profile/dto/social-account.dto';
import {
  RegisterWithGithubDto,
  RegisterWithGitlabDto,
  RegisterWithMicrosoftDto,
} from '@src/auth/dto/register.dto';

// utils
import {
  getGhUserData,
  getGitlabUserData,
  getMicrosoftUserData,
} from './utils';

// types
import type { SocialProviders } from '@prisma/client';

@Injectable()
export class SocialAccountsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async createSocialAccount({
    profileId,
    providerUserId,
    providerResponse,
    provider,
  }: SocialAccountDto) {
    return await this.prisma.socialAccount.create({
      data: {
        profileId,
        providerUserId,
        providerResponse: providerResponse ?? {},
        provider,
      },
    });
  }

  async getAllAccountsForProfile(profile: TProfile) {
    return this.prisma.socialAccount.findMany({ where: { profile } });
  }
  async findSocialAccountForUid(uid: string, provider: SocialProviders) {
    const socialAccount = await this.prisma.socialAccount.findFirst({
      where: {
        providerUserId: uid,
        provider,
      },
      include: {
        profile: true,
      },
    });

    return {
      socialAccount,
      profile: socialAccount.profile,
    };
  }

  // Linking account to profile
  //   async linkToFacebook(profileId: string, facebook: RegisterWithFacebookDto) {
  //     const thirdPartyUser = await this.getUserFromFacebook(facebook);

  //     return await this.createSocialAccount({
  //       profileId: profileId,
  //       provider: 'FACEBOOK',
  //       providerUserId: thirdPartyUser.uid,
  //       providerResponse: thirdPartyUser.rawResponse,
  //     });
  //   }

  //   async linkToGoogle(profileId: string, google: RegisterWithGoogleDto) {
  //     const thirdPartyUser = await this.getUserFromGoogle(google);

  //     return await this.createSocialAccount({
  //       profileId: profileId,
  //       provider: 'GOOGLE',
  //       providerUserId: thirdPartyUser.uid,
  //       providerResponse: thirdPartyUser.rawResponse,
  //     });
  //   }

  // Third-party services
  //   async getUserFromFacebook(
  //     facebook: RegisterWithFacebookDto,
  //   ): Promise<ThirdPartyLoginUser> {
  //     const fbMe = createFbMeEndpointWithToken(
  //       this.configService,
  //       facebook.accessToken,
  //     );
  //     const response = await axios.get(fbMe.toString());
  //     const fbUser = response.data as any;

  //     return {
  //       email: fbUser?.email,
  //       uid: fbUser?.id,
  //       avatarUrl: fbUser?.picture?.data?.url,
  //       rawResponse: fbUser,
  //     };
  //   }

  //#region GithubLink

  async linkToGithub(profileId: string, github: RegisterWithGithubDto) {
    const thirdPartyUser = await this.getUserFromGithub(github);

    return await this.createSocialAccount({
      profileId: profileId,
      provider: 'GITHUB',
      providerUserId: thirdPartyUser.uid,
      providerResponse: thirdPartyUser.rawResponse,
    });
  }

  async getUserFromGithub(
    github: RegisterWithGithubDto,
  ): Promise<ThirdPartyLoginUser> {
    const githubUser = (await getGhUserData(
      this.configService,
      github.code,
    )) as any;

    return {
      email: githubUser?.email || `${githubUser?.login}@gmail.com`,
      uid: String(githubUser?.id),
      avatarUrl: githubUser?.avatar_url,
      rawResponse: githubUser,
    };
  }

  //#endregion

  //#region GitlabLink

  async linkToGitlab(profileId: string, github: RegisterWithGitlabDto) {
    const thirdPartyUser = await this.getUserFromGitlab(github);

    return await this.createSocialAccount({
      profileId: profileId,
      provider: 'GITLAB',
      providerUserId: thirdPartyUser.uid,
      providerResponse: thirdPartyUser.rawResponse,
    });
  }

  async getUserFromGitlab(
    gitlab: RegisterWithGitlabDto,
  ): Promise<ThirdPartyLoginUser> {
    const gitlabUser = (await getGitlabUserData(
      this.configService,
      gitlab.code,
    )) as any;

    return {
      email: gitlabUser?.email || `${gitlabUser?.username}@gmail.com`,
      uid: String(gitlabUser?.id),
      avatarUrl: gitlabUser?.avatar_url,
      rawResponse: gitlabUser,
    };
  }

  //#endregion

  //#region MicrosoftLink

  async linkToMicrosoft(
    profileId: string,
    microsoft: RegisterWithMicrosoftDto,
  ) {
    const thirdPartyUser = await this.getUserFromMicrosoft(microsoft);

    return await this.createSocialAccount({
      profileId: profileId,
      provider: 'MICROSOFT',
      providerUserId: thirdPartyUser.uid,
      providerResponse: thirdPartyUser.rawResponse,
    });
  }

  async getUserFromMicrosoft(
    microsoft: RegisterWithMicrosoftDto,
  ): Promise<ThirdPartyLoginUser> {
    const microsoftUser = (await getMicrosoftUserData(
      this.configService,
      microsoft.code,
    )) as any;

    return {
      email: microsoftUser?.mail || microsoftUser?.userPrincipalName,
      uid: String(microsoftUser?.id),
      avatarUrl: microsoftUser?.avatar_url,
      rawResponse: microsoftUser,
    };
  }

  //#endregion
}
