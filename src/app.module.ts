import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule} from '@nestjs/config';
import { JobModule } from './jobs/jobs.module';
import {ThrottlerModule, ThrottlerGuard} from '@nestjs/throttler'
import { APP_GUARD, Reflector } from '@nestjs/core';
@Module({
  imports: [ThrottlerModule.forRoot([{ttl: 60000, limit: 10}]),ConfigModule.forRoot({ isGlobal: true}),PrismaModule, JobModule],
  controllers: [],
  providers: [
    Reflector,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    }
  ],
})
export class AppModule {}
