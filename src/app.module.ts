import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller.js';
import { FirebaseAdminModule } from './shared-kernel/infrastructure/firebase/firebase-admin.module.js';
import { FirebaseAuthGuard } from './shared-kernel/infrastructure/guards/firebase-auth.guard.js';
import { RolesGuard } from './shared-kernel/infrastructure/guards/roles.guard.js';
import { DomainExceptionFilter } from './shared-kernel/infrastructure/filters/domain-exception.filter.js';
import { LoggingInterceptor } from './shared-kernel/infrastructure/interceptors/logging.interceptor.js';
import { getDatabaseConfig } from './shared-kernel/infrastructure/config/database.config.js';
import { UsersModule } from './modules/users/users.module.js';

@Module({
  imports: [
    // Configuracion global de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // PostgreSQL con TypeORM
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),

    // Firebase Admin SDK (global)
    FirebaseAdminModule,

    // Modulos de dominio
    UsersModule,

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Cache en memoria
    CacheModule.register({
      isGlobal: true,
      ttl: 60000,
      max: 100,
    }),
  ],
  controllers: [AppController],
  providers: [
    // Guard global: verifica Firebase ID Token
    {
      provide: APP_GUARD,
      useClass: FirebaseAuthGuard,
    },
    // Guard global: verifica roles (custom claims)
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    // Guard global: rate limiting
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // Filter global: traduce excepciones de dominio a HTTP
    {
      provide: APP_FILTER,
      useClass: DomainExceptionFilter,
    },
    // Interceptor global: logging de requests
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
