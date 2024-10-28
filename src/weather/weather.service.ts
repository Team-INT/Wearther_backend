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
      throw new Error('Failed to fetch weather data');
    }
  }

  // 한시간마다 실행 실행하여 이전 날짜 데이터 정리
  @Cron('0 0 * * * *')
  async fetchAndStoreWeatherData() {
    const CITY_NAME = 'Seoul';
    try {
      const weatherDataList = await this.getWeatherData(CITY_NAME);
      await this.saveWeatherData(weatherDataList);
      this.logger.log('Weather data saved successfully');
    } catch (error) {
      this.logger.error('Failed to fetch or save weather data', error.stack);
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
        weather.wind_speed = data.wind.speed;
        weather.wind_deg = data.wind.deg;
        weather.timestamp = timestamp;
        weather.time_of_day = timeOfDay;

        try {
          await this.weatherRepository.save(weather);
        } catch (error) {
          this.logger.error('Failed to save weather data', error.stack);
          throw new Error('Failed to save weather data');
        }
      }
    }
  }

  // 매일 자정에 실행하여 이전 날짜 데이터 정리
  @Cron('0 0 0 * * *')
  async cleanOldWeatherData() {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const yesterday = new Date(currentDate);
    yesterday.setDate(currentDate.getDate() - 1);

    await this.weatherRepository.delete({
      timestamp: LessThan(yesterday),
      time_of_day: null,
    });
  }
}
