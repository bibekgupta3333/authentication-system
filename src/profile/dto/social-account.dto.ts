// prisma
import { SocialAccount, SocialProviders } from '@prisma/client';

export class SocialAccountDto implements Partial<SocialAccount> {
  profileId: string;
  providerResponse?: Record<string, any>;
  providerUserId: string;
  provider: SocialProviders;
}
