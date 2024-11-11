import { IsString, IsNotEmpty } from 'class-validator';

export class FashionRecommendationDto {
  @IsString()
  @IsNotEmpty()
  age: string;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsString()
  @IsNotEmpty()
  season: string;

  @IsString()
  @IsNotEmpty()
  weather: string;

  @IsString()
  @IsNotEmpty()
  style: string;

  @IsString()
  @IsNotEmpty()
  mood: string;

  @IsString()
  additionalInfo?: string;
}
