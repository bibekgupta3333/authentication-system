// nest
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

// utils
import { hashPassword } from './utils/password';

// prisma
import { SocialProviders } from '@prisma/client';

// dto
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  create(createProfileDto: CreateProfileDto) {
    return this.prisma.profile.create({
      data: createProfileDto,
      include: {
        organization: true,
      },
    });
  }

  findAll() {
    return this.prisma.profile.findMany();
  }

  findOne(id: string) {
    return this.prisma.profile.findFirst({ where: { id } });
  }

  findOneWithEmail(email: string) {
    return this.prisma.profile.findFirst({
      where: { email },
    });
  }

  update(id: string, updateProfileDto: UpdateProfileDto) {
    // (note): Please change the DTO to make it work without password update
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { isProfileComplete, name, password, ...rest } = updateProfileDto;
    const [firstName, ...lastName] = name.split(' ');

    return this.prisma.profile.update({
      where: { id },
      data: {
        ...rest,
        firstName,
        lastName: lastName.join(' '),
        ...(isProfileComplete
          ? {
              profileMetadata: {
                update: {
                  where: {
                    profileId: id,
                  },
                  data: {
                    isProfileComplete,
                  },
                },
              },
            }
          : {}),
      },
    });
  }

  updatePassword(id: string, password: string) {
    return this.prisma.profile.update({
      where: { id },
      data: { password: hashPassword(password) },
    });
  }

  remove(id: string) {
    return this.prisma.profile.delete({ where: { id } });
  }

  async findForSocialAccount(
    providerUserId: string,
    provider: SocialProviders,
  ) {
    try {
      const profile = await this.prisma.profile.findFirst({
        where: {
          socialAccounts: {
            every: {
              provider,
              providerUserId,
            },
          },
        },
      });
      return profile;
    } catch (error) {
      console.log(error);
    }
  }
}
