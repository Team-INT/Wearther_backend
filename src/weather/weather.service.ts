import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

// api
import axios from 'axios';
import { weatherApi } from 'src/common/setAxios';

// typeorm
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';

// entity
import { WeatherModel } from './entities/weather.entity';

// const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${process.env.OPEN_WEATHER_MAP_SERVICE_KEY}`;

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);

  constructor(
    @InjectRepository(WeatherModel)
    private weatherRepository: Repository<WeatherModel>,
  ) {}

  private async getWeatherData(cityName: string) {
    try {
      const response = await axios.get(
        'https://api.openweathermap.org/data/2.5/forecast',
        {
          params: {
            q: cityName,
            appid: process.env.OPEN_WEATHER_MAP_SERVICE_KEY,
            units: 'metric',
          },
        },
      );
      return response.data.list;
    } catch (error) {
      throw new Error('날씨 데이터를 불러오는데 실패 했습니다.');
    }
  }

  // 로깅용 10초마다 실행
  // @Cron('*/10 * * * * *')
  // 한시간마다 실행 실행하여 이전 날짜 정리
  @Cron('0 0 * * * *')
  async fetchAndStoreWeatherData() {
    const CITY_NAME = 'Seoul';
    try {
      const weatherDataList = await this.getWeatherData(CITY_NAME);
      await this.saveWeatherData(weatherDataList);
      this.logger.log('날씨 데이터를 성공적으로 저장 했습니다.');
    } catch (error) {
      this.logger.error(
        '날씨 데이터를 불러오거나 저장하는데 실패 했습니다.',
        error.stack,
      );
    }
  }

  private async saveWeatherData(weatherDataList: any[]) {
    for (const data of weatherDataList) {
      const timestamp = new Date(data.dt_txt);
      const existingData = await this.weatherRepository.findOne({
        where: { timestamp },
      });

      if (!existingData) {
        const timeOfDay = timestamp.getHours() < 12 ? '오전' : '오후';
        const weather = new WeatherModel();
        weather.temperature = data.main.temp;
        weather.feels_like = data.main.feels_like;
        weather.temp_min = data.main.temp_min;
        weather.temp_max = data.main.temp_max;
        weather.pressure = data.main.pressure;
        weather.humidity = data.main.humidity;
        weather.clouds = data.clouds.all;
        weather.wind_speed = data.wind.speed;
        weather.wind_deg = data.wind.deg;
        weather.timestamp = timestamp;
        weather.time_of_day = timeOfDay;

        try {
          await this.weatherRepository.save(weather);
        } catch (error) {
          this.logger.error('날씨 저장이 실패했습니다.', error.stack);
          throw new Error('날씨 저장이 실패했습니다.');
        }
      }
    }
  }

  // 매일 자정에 실행하여 이전 날짜 데이터 정리
  @Cron('0 0 0 * * *')
  private async cleanOldWeatherData() {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const yesterday = new Date(currentDate);
    yesterday.setDate(currentDate.getDate() - 1);

    await this.weatherRepository.delete({
      timestamp: LessThan(yesterday),
      time_of_day: null,
    });
  }

  // 추후 일자별, 시간별로 필요하면 로직 수정
  async getCurrentWeather() {
    const latestWeather = await this.weatherRepository.find({
      order: { timestamp: 'DESC' },
      take: 1,
    });

    return latestWeather.length > 0
      ? latestWeather[0]
      : { message: '데이터가 존재하지 않습니다.' };
  }
}
