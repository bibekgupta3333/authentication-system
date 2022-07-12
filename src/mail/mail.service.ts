// nest
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';

// types
type SendResetPasswordEmailProps = {
  email: string;
  resetToken: string;
};

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}
  async sendResetPasswordEmail({
    email,
    resetToken,
  }: SendResetPasswordEmailProps) {
    const resetPasswordUri = new URL(
      this.configService.get('FRONTEND.RESET_ENDPOINT'),
    );
    resetPasswordUri.searchParams.set('token', resetToken);

    await this.mailerService.sendMail({
      to: email,
      subject: 'Follow the provided url to change your password',
      template: `${process.cwd()}/src/mail/templates/reset-password.ejs`,
      context: {
        email,
        link: resetPasswordUri.toString(),
      },
    });
  }
}
