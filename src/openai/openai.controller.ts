import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { OpenaiService } from './openai.service';

// dto
import { FashionRecommendationDto } from './dto/openai.dto';

@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Post('recommendation')
  async getRecommendation(@Body() input: FashionRecommendationDto) {
    try {
      const result = await this.openaiService.getOpenaiResponse(input);
      return {
        success_response: {
          status: 200,
          data: {
            info: {
              summary: '패션 추천 결과입니다.',
              details: result.choices[0].message.content,
              keywords: result.choices[0].text.trim(),
              related: [],
            },
          },
        },
      };
    } catch (error) {
      return {
        error_response: {
          status: '오류',
          error: {
            code: 'API_ERROR',
            message: error.message,
          },
        },
      };
    }
  }
}
