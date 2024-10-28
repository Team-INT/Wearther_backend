import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { WeatherModel } from './entities/weather.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [TypeOrmModule.forFeature([WeatherModel]), ScheduleModule.forRoot()],
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class WeatherModule {}
