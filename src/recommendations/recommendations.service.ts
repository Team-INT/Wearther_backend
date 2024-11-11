import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OpenaiService } from '../openai/openai.service';
import { FashionRecommendationDto, OpenAIResponse } from 'src/openai/dto/openai.dto';
import { FashionRecommendation } from './entities/recommendation.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RecommendationsService {
  constructor(
    @InjectRepository(FashionRecommendation)
    private recommendationsRepository: Repository<FashionRecommendation>,
    private openaiService: OpenaiService,
  ) {}

  async createRecommendation(userId: number, input: FashionRecommendationDto) {
    const response: OpenAIResponse = await this.openaiService.getOpenaiResponse(input);

    const recommendation = this.recommendationsRepository.create({
      user: { id: userId },
      summary: response.data.info.summary,
      details: response.data.info.details,
      keywords: response.data.info.keywords,
      related: response.data.info.related,
      inputCriteria: input,
    });

    return this.recommendationsRepository.save(recommendation);
  }

  async getUserRecommendations(userId: number) {
    return this.recommendationsRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }
}
