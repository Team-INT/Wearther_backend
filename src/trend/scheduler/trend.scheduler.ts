import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TrendService } from '../trend.service';

@Injectable()
export class TrendScheduler {
  constructor(private readonly trendService: TrendService) {}

  @Cron('0 0 * * *') // 매일 자정에 실행
  async handleCron() {
    const startDate = this.getYesterdayDate();
    const endDate = this.getYesterdayDate();
    const options = {
      timeUnit: 'date',
      categoryName: '패션잡화',
      categoryParam: '50000000', // 실제 카테고리 코드를 사용해야 합니다
      device: '',
      gender: '',
      ages: [],
    };
    await this.trendService.fetchAndSaveTrends(startDate, endDate, options);

    console.log('트랜드 데이터 저정 완료');
  }

  private getYesterdayDate(): string {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  }
}
