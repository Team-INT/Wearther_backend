import { Injectable } from '@nestjs/common';

// axios
import axios from 'axios';

// entity
import { RecommendationModel } from './entities/recommendation.entity';

// TypeORM
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RecommendationService {
  constructor(
    @InjectRepository(RecommendationModel)
    private recommendationRepository: Repository<RecommendationModel>,
  ) {}

  async createRecommendation(userId: number, inputData: any) {
    // OpenAI GPT API 호출
    const response = await axios.post(
      'https://api.openai.com/v1/engines/davinci/completions',
      {
        prompt: `패션 추천: ${inputData}`,
        max_tokens: 100,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      },
    );

    const recommendationResult = response.data.choices[0].text;

    // 트렌드 데이터와 조합하는 로직 추가

    const recommendation = this.recommendationRepository.create({
      id: userId,
      input: inputData,
      result: recommendationResult,
    });

    return this.recommendationRepository.save(recommendation);
  }

  async getRecommendations(userId: number) {
    return this.recommendationRepository.find({ where: { id: userId } });
  }
}

// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { OpenaiService } from '../openai/openai.service';
// import { FashionRecommendationDto, OpenAIResponse } from 'src/openai/dto/openai.dto';
// import { FashionRecommendation } from './entities/recommendation.entity';
// import { Repository } from 'typeorm';

// @Injectable()
// export class RecommendationsService {
//   constructor(
//     @InjectRepository(FashionRecommendation)
//     private recommendationsRepository: Repository<FashionRecommendation>,
//     private openaiService: OpenaiService,
//   ) {}

//   async createRecommendation(userId: number, input: FashionRecommendationDto) {
//     const response: OpenAIResponse = await this.openaiService.getOpenaiResponse(input);

//     const recommendation = this.recommendationsRepository.create({
//       user: { id: userId },
//       summary: response.data.info.summary,
//       details: response.data.info.details,
//       keywords: response.data.info.keywords,
//       related: response.data.info.related,
//       inputCriteria: input,
//     });

//     return this.recommendationsRepository.save(recommendation);
//   }

//   async getUserRecommendations(userId: number) {
//     return this.recommendationsRepository.find({
//       where: { user: { id: userId } },
//       order: { createdAt: 'DESC' },
//     });
//   }
// }
