import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsArray } from 'class-validator';

export class FashionRecommendationDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty()
  age: string;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsArray()
  @IsNotEmpty()
  fashionTypes: string[];

  @IsArray()
  @IsNotEmpty()
  moods: string[];

  @IsString()
  @IsOptional()
  shoppingMall?: string;

  @IsString()
  @IsOptional()
  otherShoppingMall?: string;

  @IsString()
  @IsOptional()
  additionalInfo?: string;

  @IsBoolean()
  @IsNotEmpty()
  agreement: boolean;
}

export interface OpenAIResponse {
  status: number;
  data: {
    info: {
      summary: string;
      details: string;
      keywords: string[];
      related: string[];
    };
  };
}
