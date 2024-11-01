import { IsString, IsArray, IsOptional, IsDateString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { TrendModel } from '../entities/trend.entity';

export class TrendRequestDto extends PartialType(TrendModel) {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsString()
  timeUnit: string;

  @IsArray()
  category: { name: string; param: string[] }[];

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsArray()
  ages?: string[];

  @IsOptional()
  @IsString()
  device?: string;
}
