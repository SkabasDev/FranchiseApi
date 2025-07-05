import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FranchiseModule } from './franchise/franchise.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSource from './data-source';
import { DataSourceOptions } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSource.options as DataSourceOptions),
    FranchiseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}