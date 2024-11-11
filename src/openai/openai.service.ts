import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

// dto
import { FashionRecommendationDto } from './dto/openai.dto';

@Injectable()
export class OpenaiService {
  private readonly openaiApiKey = process.env.OPENAI_API_KEY;
  private readonly openaiUrl = 'https://api.openai.com/v1/chat/completions';
  private readonly model = 'gpt-4o-mini';
  private readonly logger = new Logger(OpenaiService.name);

  constructor(private readonly configService: ConfigService) {}

  async getOpenaiResponse(input: FashionRecommendationDto) {
    const prompt = this.buildPrompt(input);
    try {
      const response = await axios.post(
        this.openaiUrl,
        {
          model: this.model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 150,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      this.logger.error('Error calling OpenAI API', error);
      throw error;
    }
  }

  private buildPrompt(input: FashionRecommendationDto) {
    const { age, gender, season, weather, style, mood, additionalInfo } = input;

    return `
    연령: ${age}
    성별: ${gender}
    계절: ${season}
    날씨: ${weather}
    스타일: ${style}
    분위기: ${mood}
    추가 정보: ${additionalInfo}

    위 정보를 바탕으로 날씨와 계절에 알맞고, 사용자가 선택한 스타일과 분위기에 어울리는 패션 키워드를 추천하고, 착장, 추천 아이템, 브랜드를 제시해주세요.
    `;
  }
}
