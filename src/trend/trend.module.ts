import { Module } from '@nestjs/common';
import { TrendService } from './trend.service';
import { TrendController } from './trend.controller';

@Module({
  controllers: [TrendController],
  providers: [TrendService],
})
export class TrendModule {}
