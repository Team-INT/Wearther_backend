import { Injectable, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import OpenAI from 'openai';
import openaiConfig from './config/openai.config';
import { FashionRecommendationDto } from './dto/openai.dto';
import { OpenAIResponse } from './dto/openai.dto';

@Injectable()
export class OpenaiService {
  private openai: OpenAI;
  private assistantId: string;

  constructor(
    @Inject(openaiConfig.KEY)
    private config: ConfigType<typeof openaiConfig>,
  ) {
    this.openai = new OpenAI({
      apiKey: this.config.apiKey,
      organization: this.config.organization,
    });
    this.assistantId = this.config.assistantId;
  }

  async getOpenaiResponse(input: FashionRecommendationDto): Promise<OpenAIResponse> {
    try {
      // 1. 스레드 생성
      const thread = await this.openai.beta.threads.create();

      // 2. 메시지 추가
      await this.openai.beta.threads.messages.create(thread.id, {
        role: 'user',
        content: this.buildPrompt(input),
      });

      // 3. 어시스턴트와 실행
      const run = await this.openai.beta.threads.runs.create(thread.id, {
        assistant_id: this.assistantId,
      });

      // 4. 실행 완료 대기
      let runStatus = await this.openai.beta.threads.runs.retrieve(thread.id, run.id);

      while (runStatus.status !== 'completed') {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        runStatus = await this.openai.beta.threads.runs.retrieve(thread.id, run.id);
      }

      // 5. 응답 가져오기 및 파싱
      const messages = await this.openai.beta.threads.messages.list(thread.id);
      const lastMessage = messages.data[0];

      if ('text' in lastMessage.content[0]) {
        const rawResponse = JSON.parse(lastMessage.content[0].text.value);
        return {
          status: 200,
          data: {
            info: {
              summary: rawResponse.success_response.data.info.summary,
              details: rawResponse.success_response.data.info.details,
              keywords: rawResponse.success_response.data.info.keywords || [],
              related: rawResponse.success_response.data.info.related || [],
            },
          },
        }; 
      }
      throw new Error('응답 메시지가 텍스트 형식이 아닙니다.');
    } catch (error) {
      console.error('Detailed error:', error);
      throw new Error(`OpenAI Assistant API 요청 중 오류가 발생했습니다: ${error.message}`);
    }
  }

  private buildPrompt(input: FashionRecommendationDto): string {
    return `
      다음 조건에 맞는 패션 스타일을 추천해주세요:
      - 연령대: ${input.age}
      - 성별: ${input.gender}
      - 계절: ${input.season}
      - 날씨: ${input.weather}
      - 선호 스타일: ${input.style}
      - 기분/분위기: ${input.mood}
      - 추가 정보: ${input.additionalInfo}
    `;
  }
}
