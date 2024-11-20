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
              details: result,
              keywords: [],
              related: [],
            },
          },
        },
      };
    } catch (error) {
      console.error('Error in recommendation:', error);
      return {
        error_response: {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: {
            code: 'API_ERROR',
            message: error.message,
          },
        },
      };
    }
  }
}
