//  nest
import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { BadRequestException } from '@nestjs/common';

// controllers
import { AppController } from './app.controller';

// modules
import { PaginationModule } from './common/pagination/pagination.module';

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

          rejectOnNotFound: {
            findUnique: () => new BadRequestException('Resource Not Found'),
          },
        },
        explicitConnect: true,
      },
    }),
    PaginationModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
