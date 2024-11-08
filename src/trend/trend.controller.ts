import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags, ApiResponse } from '@nestjs/swagger';
import { TrendService } from './trend.service';

@Controller('trend')
@ApiTags('Trend')
export class TrendController {
  constructor(private readonly trendService: TrendService) {}

  /**
   * 트렌드 데이터를 가져오는 엔드포인트
   *
   * @param startDate - 시작 날짜 (YYYY-MM-DD 형식)
   * @param endDate - 끝 날짜 (YYYY-MM-DD 형식)
   * @param categoryName - 카테고리 이름 (쉼표로 구분된 여러 값)
   * @param categoryParam - 카테고리 파라미터 (쉼표로 구분된 여러 값)
   * @param gender - 성별 필터 (optional, "male" or "female")
   * @param ages - 연령대 필터 (optional, 쉼표로 구분된 여러 값)
   * @param device - 기기 필터 (optional)
   * @param timeUnit - 시간 단위 (optional, e.g., "day", "week", "month")
   */
  @ApiOperation({ summary: '트렌드 데이터 조회' })
  @ApiResponse({
    status: 200,
    description: '트렌드 데이터 조회 성공',
    schema: {
      example: [
        {
          id: 2,
          createdAt: '2024-10-31T20:46:39.217Z',
          updatedAt: '2024-10-31T20:46:39.217Z',
          isDeleted: false,
          date: '2024-09-30T15:00:00.000Z',
          category_name: '화장품/미용',
          category_param: '50000002',
          device: 'all',
          gender: 'all',
          age_group: '',
          value: 93.68639,
        },
        {
          id: 3,
          createdAt: '2024-10-31T20:46:39.232Z',
          updatedAt: '2024-10-31T20:46:39.232Z',
          isDeleted: false,
          date: '2024-10-01T15:00:00.000Z',
          category_name: '화장품/미용',
          category_param: '50000002',
          device: 'all',
          gender: 'all',
          age_group: '',
          value: 88.39632,
        },
      ],
    },
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청',
    schema: {
      example: {
        statusCode: 400,
        message: '잘못된 파라미터입니다.',
        error: 'Bad Request',
      },
    },
  })
  @ApiQuery({
    name: 'startDate',
    description: '조회 시작 날짜 (YYYY-MM-DD 형식)',
    required: true,
    example: '2024-11-01',
  })
  @ApiQuery({
    name: 'endDate',
    description: '조회 끝 날짜 (YYYY-MM-DD 형식)',
    required: true,
    example: '2024-11-07',
  })
  @ApiQuery({
    name: 'categoryName',
    description: '조회할 카테고리 이름 (쉼표로 구분)',
    required: true,
    example: '패션,음식',
  })
  @ApiQuery({
    name: 'categoryParam',
    description: '조회할 카테고리 파라미터 (쉼표로 구분)',
    required: true,
    example: 'fashion,food',
  })
  @ApiQuery({
    name: 'gender',
    description: '성별 필터 (male, female)',
    required: false,
    example: 'female',
  })
  @ApiQuery({
    name: 'ages',
    description: '조회할 연령대 필터 (쉼표로 구분)',
    required: false,
    example: '20s,30s',
  })
  @ApiQuery({
    name: 'device',
    description: '기기 필터 (예: mobile, desktop)',
    required: false,
    example: 'mobile',
  })
  @ApiQuery({
    name: 'timeUnit',
    description: '시간 단위 (예: day, week, month)',
    required: true,
    example: 'week',
  })
  @Get()
  async getTrends(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('categoryName') categoryName: string,
    @Query('categoryParam') categoryParam: string,
    @Query('timeUnit') timeUnit: string,
    @Query('gender') gender?: string,
    @Query('ages') ages?: string,
    @Query('device') device?: string,
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
