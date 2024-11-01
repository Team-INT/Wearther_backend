import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

// api
import axios from 'axios';

// typeorm
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, Between } from 'typeorm';

// entity
import { WeatherModel } from './entities/weather.entity';

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);

  constructor(
    @InjectRepository(WeatherModel)
    private weatherRepository: Repository<WeatherModel>,
  ) {}

  private async getCurrentWeatherData(cityName: string) {
    try {
      const response = await axios.get(process.env.WEATHER_ENDPOINT, {
        params: {
          q: cityName,
          appid: process.env.OPEN_WEATHER_MAP_SERVICE_KEY,
          units: 'metric',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('현재 날씨 데이터를 불러오는데 실패했습니다.');
    }
  }

  private async getForecastWeatherData(cityName: string) {
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
      throw new Error('예보 데이터를 불러오는데 실패했습니다.');
    }
  }

  // 현재 날씨 데이터를 매시간마다 저장
  @Cron('0 0 * * * *')
  async fetchAndStoreCurrentWeatherData() {
    const CITY_NAME = 'Seoul';
    try {
      const weatherData = await this.getCurrentWeatherData(CITY_NAME);
      await this.saveWeatherData(weatherData);
      this.logger.log('현재 날씨 데이터를 성공적으로 저장했습니다.');
    } catch (error) {
      this.logger.error(
        '현재 날씨 데이터를 불러오거나 저장하는데 실패했습니다.',
        error.stack,
      );
    }
  }

  // 예보 데이터를 매일 자정에 저장
  @Cron('0 0 0 * * *')
  async fetchAndStoreForecastData() {
    const CITY_NAME = 'Seoul';
    try {
      const weatherDataList = await this.getForecastWeatherData(CITY_NAME);
      for (const data of weatherDataList) {
        await this.saveWeatherData(data);
      }
      this.logger.log('예보 데이터를 성공적으로 저장했습니다.');
    } catch (error) {
      this.logger.error(
        '예보 데이터를 불러오거나 저장하는데 실패했습니다.',
        error.stack,
      );
    }
  }

  private async saveWeatherData(data: any) {
    const timestamp = data.dt
      ? new Date(data.dt * 1000)
      : new Date(data.dt_txt);
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

      console.log('저장할 날씨 데이터:', weather);

      try {
        await this.weatherRepository.save(weather);
      } catch (error) {
        this.logger.error('날씨 저장에 실패했습니다.', error.stack);
        throw new Error('날씨 저장에 실패했습니다.');
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
    });
  }

  // 가장 최근의 현재 날씨 데이터 반환
  async getCurrentWeather() {
    const latestWeather = await this.weatherRepository.find({
      order: { timestamp: 'DESC' },
      take: 1,
    });

    return latestWeather.length > 0
      ? latestWeather[0]
      : { message: '데이터가 존재하지 않습니다.' };
  }

  // 5일치의 예보 데이터 반환
  async getForecastWeather() {
    const currentDate = new Date();
    const fiveDaysLater = new Date();
    fiveDaysLater.setDate(currentDate.getDate() + 5);

    const forecastData = await this.weatherRepository.find({
      where: {
        timestamp: Between(currentDate, fiveDaysLater),
      },
      order: { timestamp: 'ASC' },
    });

    return forecastData.length > 0
      ? forecastData
      : { message: '예보 데이터가 존재하지 않습니다.' };
  }
}
