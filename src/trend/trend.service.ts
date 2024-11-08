import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
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
    private readonly configService: ConfigService,
  ) {
    this.NAVER_CLIENT_ID = this.configService.get('NAVER_CLIENT_ID');
    this.NAVER_CLIENT_SECRET = this.configService.get('NAVER_CLIENT_SECRET');
  }

  /**
   * 트렌드 데이터를 조회하는 함수
   * @param options 검색 옵션 (날짜, 카테고리, 성별, 장치, 연령대 등)
   * @returns 트렌드 데이터 배열
   */
  async findTrends(options: any) {
    const query = this.trendRepository.createQueryBuilder('trend');

    if (options.startDate && options.endDate) {
      query.andWhere('trend.date BETWEEN :startDate AND :endDate', {
        startDate: options.startDate,
        endDate: options.endDate,
      });
    }

    if (options.categories) {
      query.andWhere('trend.category_param IN (:...categories)', {
        categories: options.categories.map((c) => c.param[0]),
      });
    }

    if (options.gender) {
      query.andWhere('trend.gender = :gender', { gender: options.gender });
    }

    if (options.device) {
      query.andWhere('trend.device = :device', { device: options.device });
    }

    if (options.ages && options.ages.length > 0) {
      query.andWhere('trend.age_group IN (:...ages)', { ages: options.ages });
    }

    return query.getMany();
  }

  /**
   * 트렌드 데이터를 네이버 API에서 조회하고 저장하는 함수
   * @param startDate 시작 날짜 (yyyy-mm-dd 형식)
   * @param endDate 종료 날짜 (yyyy-mm-dd 형식)
   * @param options 검색 옵션 (카테고리, 장치, 성별, 연령대 등)
   * @returns 저장된 트렌드 데이터 배열
   */
  async fetchAndSaveTrends(startDate: string, endDate: string, options: any) {
    const existingData = await this.findTrends(options);

    if (existingData.length > 0) {
      return existingData;
    }

    const requestBody = {
      startDate,
      endDate,
      timeUnit: options.timeUnit || 'date',
      category: options.categories.map((category) => ({
        name: category.name,
        param: category.param,
      })),
      device: options.device,
      gender: options.gender,
      ages: options.ages,
    };

    try {
      const response = await axios.post(process.env.NAVER_TREND_ENDPOINT, requestBody, {
        headers: {
          'X-Naver-Client-Id': this.NAVER_CLIENT_ID,
          'X-Naver-Client-Secret': this.NAVER_CLIENT_SECRET,
          'Content-Type': 'application/json',
        },
      });

      const trendsData = response.data.results;
      const savedTrends: TrendModel[] = [];

      for (const trend of trendsData) {
        if (trend.data && Array.isArray(trend.data)) {
          for (const data of trend.data) {
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
      }

      console.log('트랜드 데이터 호출 성공 및 저장 완료')

      return savedTrends;
    } catch (error) {
      console.error(
        '트렌드 데이터를 저장하는 중 오류 발생:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        error.response?.data?.message || '트렌드 데이터를 가져오는 데 실패했습니다',
        error.response?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * 오늘 날짜를 yyyy-mm-dd 형식으로 반환하는 함수
   * @returns 오늘 날짜 문자열
   */
  private getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
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
