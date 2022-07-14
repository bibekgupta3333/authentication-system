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
} from '@nestjs/common';

// services
import { AuthService } from './auth.service';

// dto
import {
  ResetPasswordDto,
  RegisterWithEmailDto,
  InitiateResetPasswordDto,
} from './dto';

// guards
import { JwtAuthGuard, LocalAuthGuard, JwtRefreshGuard } from './guards';

// decorators
import { AuthContext } from '@src/common/decorators';

// entites
import {
  ResetPasswordResponse,
  TokenResponse,
} from './entites/response.entity';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
