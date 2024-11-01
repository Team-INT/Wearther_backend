import { Module } from '@nestjs/common';
import { TrendService } from './trend.service';
import { TrendController } from './trend.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { TrendModel } from './entities/trend.entity';

import { TrendScheduler } from './scheduler/trend.scheduler';

@Module({
  imports: [TypeOrmModule.forFeature([TrendModel])],
  controllers: [TrendController],
  providers: [TrendService, TrendScheduler],
})
export class TrendModule {}
