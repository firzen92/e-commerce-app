import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { appConfig, supabaseConfig, validateEnv } from './config';
import { HttpExceptionFilter } from './common/filters';
import { LoggingInterceptor } from './common/interceptors';
import { SupabaseModule } from './supabase';
import { AuthModule } from './modules/auth';
import { ProductsModule } from './modules/products';
import { OrdersModule } from './modules/orders';
import { CategoriesModule } from './modules/categories';
import { WishlistModule } from './modules/wishlist';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
      load: [appConfig, supabaseConfig],
    }),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60_000, limit: 100 }],
    }),
    SupabaseModule,
    AuthModule,
    ProductsModule,
    OrdersModule,
    CategoriesModule,
    WishlistModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
  ],
})
export class AppModule {}
