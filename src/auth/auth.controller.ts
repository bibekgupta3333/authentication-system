// nest
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Get,
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Query,
  BadRequestException,
} from '@nestjs/common';

// services
import { AuthService } from './auth.service';

// dto
import {
  ResetPasswordDto,
  RegisterWithEmailDto,
  InitiateResetPasswordDto,
  RegisterWithGithubDto,
  RegisterWithGitlabDto,
  RegisterWithMicrosoftDto,
} from './dto';

// guards
import {
  JwtAuthGuard,
  LocalAuthGuard,
  JwtRefreshGuard,
  GithubAuthGuard,
  GitlabAuthGuard,
  MicrosoftAuthGuard,
} from './guards';

// decorators
import { AuthContext } from '@src/common/decorators';

// entites
import {
  ResetPasswordResponse,
  TokenResponse,
} from './entites/response.entity';

// services
import { SocialAccountsService } from '@src/profile/social-accounts/social-account.service';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly socialService: SocialAccountsService,
  ) {}

  //#region Login

  @ApiResponse({
    status: 201,
    type: TokenResponse,
  })
  @ApiBody({ type: RegisterWithEmailDto })
  @UseGuards(LocalAuthGuard)
  @Post(['login', 'login/email'])
  async loginWithEmail(
    @Req() req: TExpressRequest,
    @AuthContext('profile') profile: TProfile,
  ) {
    return await this.authService.authenticateRequest(req, profile);
  }

  @ApiBody({ type: RegisterWithGithubDto })
  @UseGuards(GithubAuthGuard)
  @Post('login/github')
  async loginWithGithub(
    @Req() req: TExpressRequest,
    @AuthContext('profile') profile: TProfile,
  ) {
    return await this.authService.authenticateRequest(req, profile);
  }

  @ApiBody({ type: RegisterWithGitlabDto })
  @UseGuards(GitlabAuthGuard)
  @Post('login/gitlab')
  async loginWithGitlab(
    @Req() req: TExpressRequest,
    @AuthContext('profile') profile: TProfile,
  ) {
    return await this.authService.authenticateRequest(req, profile);
  }

  @ApiBody({ type: RegisterWithMicrosoftDto })
  @UseGuards(MicrosoftAuthGuard)
  @Post('login/microsoft')
  async loginWithMicrosoft(
    @Req() req: TExpressRequest,
    @AuthContext('profile') profile: TProfile,
  ) {
    return await this.authService.authenticateRequest(req, profile);
  }

  //#endregion

  //#region Registration

  @ApiResponse({
    status: 201,
    type: TokenResponse,
  })
  @Post(['register', 'register/email'])
  async registerWithEmail(
    @Req() req: TExpressRequest,
    @Body() registrationData: RegisterWithEmailDto,
  ) {
    const profile = await this.authService.registerWithEmail(registrationData);
    return await this.authService.authenticateRequest(req, profile);
  }

  @ApiBody({ type: RegisterWithGithubDto })
  @UseGuards(GithubAuthGuard)
  @Post('register/github')
  async registerWithGithub(
    @Req() req: TExpressRequest,
    @AuthContext('profile') existingProfile: TProfile,
  ) {
    if (existingProfile) throw new BadRequestException('User Already Exists!');

    const profile = await this.authService.registerWithGithub(
      req.authInfo as ThirdPartyLoginUser,
    );

    return await this.authService.authenticateRequest(req, profile);
  }

  @ApiBody({ type: RegisterWithGitlabDto })
  @UseGuards(GitlabAuthGuard)
  @Post('register/gitlab')
  async registerWithGitlab(
    @Req() req: TExpressRequest,
    @AuthContext('profile') existingProfile: TProfile,
  ) {
    if (existingProfile) throw new BadRequestException('User Already Exists!');

    const profile = await this.authService.registerWithGitlab(
      req.authInfo as ThirdPartyLoginUser,
    );

    return await this.authService.authenticateRequest(req, profile);
  }

  @ApiBody({ type: RegisterWithMicrosoftDto })
  @UseGuards(MicrosoftAuthGuard)
  @Post('register/microsoft')
  async registerWithMicrosoft(
    @Req() req: TExpressRequest,
    @AuthContext('profile') existingProfile: TProfile,
  ) {
    if (existingProfile) throw new BadRequestException('User Already Exists!');

    const profile = await this.authService.registerWithMicrosoft(
      req.authInfo as ThirdPartyLoginUser,
    );

    return await this.authService.authenticateRequest(req, profile);
  }

  //#endregion

  //#region Social Linking
  @UseGuards(JwtAuthGuard)
  @Post('link/github')
  async linkGithub(
    @AuthContext('profile') profile: TProfile,
    @Body() github: RegisterWithGithubDto,
  ) {
    return await this.socialService.linkToGithub(profile.id, github);
  }

  @UseGuards(JwtAuthGuard)
  @Post('link/gitlab')
  async linkGitlab(
    @AuthContext('profile') profile: TProfile,
    @Body() gitlab: RegisterWithGitlabDto,
  ) {
    return await this.socialService.linkToGitlab(profile.id, gitlab);
  }

  @UseGuards(JwtAuthGuard)
  @Post('link/microsoft')
  async linkMicrosoft(
    @AuthContext('profile') profile: TProfile,
    @Body() microsoft: RegisterWithMicrosoftDto,
  ) {
    return await this.socialService.linkToGitlab(profile.id, microsoft);
  }

  //#endregion

  @ApiResponse({
    status: 200,
    type: TokenResponse,
  })
  @UseGuards(JwtRefreshGuard)
  @Get('token/refresh')
  async refreshToken(@Query('token') token: string) {
    return await this.authService.getRefreshToken(token);
  }

  @ApiResponse({
    status: 201,
    type: ResetPasswordResponse,
  })
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(resetPasswordDto);
    return { message: 'Password Reset Successful' };
  }

  @ApiResponse({
    status: 201,
    type: ResetPasswordResponse,
  })
  @Post('initiate-reset-password')
  async initiateResetPassword(
    @Body() initiatePasswordDto: InitiateResetPasswordDto,
  ) {
    await this.authService.initiateResetPassword(initiatePasswordDto);
    return { message: 'Password Reset Initiated' };
  }

  @ApiResponse({
    status: 201,
    type: ResetPasswordResponse,
  })
  @Post('verify-reset-token')
  async verifyResetToken(@Body() token: string) {
    await this.authService.verifyResetToken(token);
    return { message: 'Token Verified' };
  }

  @ApiResponse({
    status: 200,
  })
  @Get('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: TExpressRequest) {
    await this.authService.logoutRequest(req);
  }
}
