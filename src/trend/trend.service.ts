import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';

import axios from 'axios';

// entity
import { TrendModel } from './entities/trend.entity';

// TypeORM
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TrendService {
  private NAVER_CLIENT_ID: string;
  private NAVER_CLIENT_SECRET: string;

  constructor(
    @InjectRepository(TrendModel)
    private readonly trendRepository: Repository<TrendModel>,
    // private readonly httpService: HttpService
    private readonly configService: ConfigService,
  ) {
    this.NAVER_CLIENT_ID = this.configService.get('NAVER_CLIENT_ID');
    this.NAVER_CLIENT_SECRET = this.configService.get('NAVER_CLIENT_SECRET');
  }

  async findTrends(options: any) {
    const query = this.trendRepository.createQueryBuilder('trend');

    if (options.startDate && options.endDate) {
      query.andWhere('trend.date BETWEEN :startDate AND :endDate', {
        startDate: options.startDate,
        endDate: options.endDate,
      });
    }

    if (options.categoryParam) {
      query.andWhere('trend.category_param = :categoryParam', {
        categoryParam: options.categoryParam,
      });
    }

    if (options.gender) {
      query.andWhere('trend.gender = :gender', { gender: options.gender });
    }

    if (options.device) {
      query.andWhere('trend.device = :device', { device: options.device });
    }

    if (options.ages && options.ages.length > 0) {
      query.andWhere('trend.age_group IN (:...ages', { ages: options.ages });
    }

    return query.getMany();
  }

  async fetchAndSaveTrends(startDate: string, endDate: string, options: any) {
    const existingData = await this.findTrends(options);

    if (existingData.length > 0) {
      return existingData;
    }

    const response = await axios.post(
      process.env.NAVER_TREND_ENDPOINT,
      {
        startDate,
        endDate,
        timeUnit: 'date',
        category: options.category,
        categoryName: options.categoryName,
        categoryParam: options.categoryParam,
        device: options.device,
        gender: options.gender,
        ages: options.ages,
      },
      {
        headers: {
          'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
          'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET,
          'Content-Type': 'application/json',
        },
      },
    );

    const trendsData = response.data.results;

    const savedTrends: TrendModel[] = [];

    for (const trend of trendsData) {
      for (const data of trend) {
        const newTrend = this.trendRepository.create({
          date: data.period,
          category_name: trend.title,
          category_param: trend.category[0],
          device: options.device || 'all',
          gender: options.gender || 'all',
          age_group: options.ages ? options.ages.join(',') : 'all',
          value: data.ratio,
        });

        const savedTrend = await this.trendRepository.save(newTrend);
        savedTrends.push(savedTrend);
      }
    }

    return savedTrends;
  }

  private getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0]; // yyyy-mm-dd 형식
  }

  // private async canCallApi(): Promise<boolean> {
  //   const key = `api_request_count:${this.getTodayDate()}`;

  //   // 현재 요청 횟수 가져오기
  //   let requestCount = await this.redisClient.get(key);

  //   if (!requestCount) {
  //     requestCount = '0';
  //     // 키의 만료 시간을 오늘 자정까지로 설정
  //     const now = new Date();
  //     const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  //     const expireSeconds = Math.floor((tomorrow.getTime() - now.getTime()) / 1000);

  //     await this.redisClient.expire(key, expireSeconds);
  //   }

  //   if (parseInt(requestCount) >= 1000) {
  //     return false;
  //   }

  //   // 요청 횟수 증가
  //   await this.redisClient.incr(key);

  //   return true;
  // }
}
