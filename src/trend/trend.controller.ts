import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { TrendService } from './trend.service';

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

    const categoryNames = categoryName.split(',');
    const categoryParams = categoryParam.split(',');
    const categories = categoryNames.map((name, index) => ({
      name: name.trim(),
      param: categoryParams[index] ? [categoryParams[index].trim()] : [],
    }));

    const options = {
      startDate,
      endDate,
      gender,
      ages: ageArray,
      device,
      categories,
      timeUnit,
    };

    try {
      const trends = await this.trendService.fetchAndSaveTrends(startDate, endDate, options);
      return trends;
    } catch (error) {
      console.error('Error fetching trends:', error.response?.data || error.message);
      throw new HttpException(error.message, error.response?.status || HttpStatus.BAD_REQUEST);
    }
  }
}
