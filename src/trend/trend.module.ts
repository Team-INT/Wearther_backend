import { Module } from '@nestjs/common';
import { TrendService } from './trend.service';
import { TrendController } from './trend.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { TrendModel } from './entities/trend.entity';

import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([TrendModel]),
    ScheduleModule.forRoot(), // 스케줄러 사용을 위한 모듈 등록
  ],
  controllers: [TrendController],
  providers: [TrendService],
})
export class TrendModule {}
