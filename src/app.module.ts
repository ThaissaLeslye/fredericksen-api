/**
 * @file app.module.ts
 * @description Root module of the NestJS application.
 * @responsibility Orchestrates the application's lifecycle by aggregating core, feature, and configuration modules.
 * @strategy Configures global behaviors (environment validation, static file serving, and logging) and registers feature domains.
 * @logic Integrates ConfigModule with custom env validation, sets up Compodoc documentation serving via ServeStaticModule, registers global LoggingInterceptor, and imports core modules (User, Profile, Prisma, Auth).
 * @mapping Acts as the central registry linking NestJS components, controllers (AppController), and providers (AppService) to the main application context.
 */

import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { ProfileModule } from './modules/profile/profile.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { validate } from './common/config/env.validation';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'documentation'),
      serveRoot: '/compodoc',
    }),
    ConfigModule.forRoot({
      validate,
      isGlobal: true,
    }),
    UserModule,
    ProfileModule,
    PrismaModule,
    AuthModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
