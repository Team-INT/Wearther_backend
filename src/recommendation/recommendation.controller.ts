// src/modules/recommendation/recommendation.controller.ts
import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('recommendations')
export class RecommendationController {
  constructor(private recommendationService: RecommendationService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createRecommendation(@Req() req, @Body() inputData: any) {
    return this.recommendationService.createRecommendation(
      req.user.userId,
      inputData,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getRecommendations(@Req() req) {
    return this.recommendationService.getRecommendations(req.user.userId);
  }
}
