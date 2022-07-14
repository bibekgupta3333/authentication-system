//  nest
import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { ConfigModule } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';

// controllers
import { AppController } from './app.controller';

// modules
import { PaginationModule } from './common/pagination/pagination.module';
import { ProfileModule } from './profile/profile.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';

// config
import ApplicationEnvironment from '@config/env';

@Module({
  imports: [
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        prismaOptions: {
          log:
            process.env.NODE_ENV === 'production'
              ? ['info', 'query', 'error', 'warn']
              : ['info', 'query', 'error', 'warn'],
        },
        explicitConnect: true,
      },
    }),
    ConfigModule.forRoot({
      load: [ApplicationEnvironment],
      isGlobal: true,
    }),
    PaginationModule,
    ProfileModule,
    AuthModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
