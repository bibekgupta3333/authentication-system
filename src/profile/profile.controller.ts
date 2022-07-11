import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdatePasswordDto, UpdateProfileDto } from './dto/update-profile.dto';
import { AuthContext } from '@src/common/decorators';
import { ReadOnlyProfileEntity } from './entities/profile.entity';
import { ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/auth/guards';
import { checkPassword } from '@src/auth/utils';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(['', ':id'])
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Param('id') id: string,
    @AuthContext('profile') profile: TProfile,
    @Query('email') email: string,
  ) {
    // just for checking if the email already exist or not.
    if (email) {
      return new ReadOnlyProfileEntity(
        await this.profileService.findOneWithEmail(email),
      );
    }

    // fetching a profile
    if (!id) id = profile.id;

    return this.profileService.findOne(id);
  }

  @Patch(['', ':id'])
  @ApiBody({ type: UpdateProfileDto })
  @UseGuards(JwtAuthGuard)
  partialUpdate(
    @Body()
    updateProfileDto: UpdateProfileDto,
    @Param('id') id: string,
    @AuthContext('profile') profile: TProfile,
  ) {
    if (!id) id = profile.id;

    return this.profileService.update(id, updateProfileDto);
  }

  @Put(['', ':id'])
  @ApiBody({ type: UpdateProfileDto })
  @UseGuards(JwtAuthGuard)
  update(
    @Body()
    updateProfileDto: UpdateProfileDto,
    @Param('id') id: string,
    @AuthContext('profile') profile: TProfile,
  ) {
    if (!id) id = profile.id;

    return this.profileService.update(id, updateProfileDto);
  }

  @Delete(['', ':id'])
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @AuthContext('profile') profile: TProfile) {
    if (!id) id = profile.id;

    return this.profileService.remove(id);
  }

  @Post('update-password')
  @UseGuards(JwtAuthGuard)
  updatePassword(
    @AuthContext('profile') profile: TProfile,
    @Body() { oldPassword, newPassword }: UpdatePasswordDto,
  ) {
    if (!checkPassword(oldPassword, profile.password))
      throw new BadRequestException('User not found!');

    return this.profileService.updatePassword(profile.id, newPassword);
  }
}
