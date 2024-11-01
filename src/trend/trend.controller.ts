import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TrendService } from './trend.service';
import { CreateTrendDto } from './dto/create-trend.dto';
import { UpdateTrendDto } from './dto/update-trend.dto';

@Controller('trend')
export class TrendController {
  constructor(private readonly trendService: TrendService) {}

  @Get()
  async getTrends(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('categoryName') categoryName: string,
    @Query('categoryParam') categoryParam: string,
    @Query('gender') gender?: string,
    @Query('ages') ages?: string,
    @Query('device') device?: string,
    @Query('timeUnit') timeUnit?: string,
  ) {
    const ageArray = ages ? ages.split(',') : [];
    const options = {
      gender,
      ages: ageArray,
      device,
      categoryName,
      categoryParam,
      timeUnit,
    };

    try {
      const trends = await this.trendService.fetchAndSaveTrends(startDate, endDate, options);
      return trends;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.getStatus ? error.getStatus() : HttpStatus.BAD_REQUEST,
      );
    }
  }
}
