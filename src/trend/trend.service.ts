import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import axios from 'axios';

// entity
import { TrendModel } from './entities/trend.entity';

// TypeORM
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TrendService {
  constructor(
    @InjectRepository(TrendModel)
    private readonly trendRepository: Repository<TrendModel>,
  ) {}

  @Cron('0 0 2 * * *')
  async fetchTrends() {
    const response = await axios.get('네이버 데이터랩 엔드포인트', {
      params: {},
      headers: {
        'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET,
      },
    });

    const trendsData = response.data;
  }

  async getTrends(): Promise<TrendModel[]> {
    return this.trendRepository.find({
      where: {},
    });
  }
}
