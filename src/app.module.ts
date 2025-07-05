import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FranchiseModule } from './franchise/franchise.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSource from './data-source';
import { DataSourceOptions } from 'typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      ttl: 60 * 60,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSource.options as DataSourceOptions),
    FranchiseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}