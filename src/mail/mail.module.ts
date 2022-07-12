// nest
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

// services
import { MailService } from './mail.service';

// utils
import { join } from 'path';

// env
import { ENV } from '@config/env';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: ENV.EMAIL.HOST,
        port: ENV.EMAIL.PORT,
        secure: false,
        auth: {
          user: ENV.EMAIL.HOST_USER,
          pass: ENV.EMAIL.HOST_PASSWORD,
        },
      },
      defaults: {
        from: "'No Reply' <noreply@fastaccount.com>",
      },
      template: {
        dir: join(process.cwd(), 'src', 'mail', 'templates'),
        adapter: new EjsAdapter(),
        options: {
          strict: false,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
