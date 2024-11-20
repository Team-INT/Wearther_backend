import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OpenaiController } from './openai.controller';
import { OpenaiService } from './openai.service';
import openaiConfig from './config/openai.config';

@Module({
  imports: [ConfigModule.forFeature(openaiConfig)],
  controllers: [OpenaiController],
  providers: [OpenaiService],
})
export class OpenaiModule {}
