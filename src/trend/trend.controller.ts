import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TrendService } from './trend.service';
import { CreateTrendDto } from './dto/create-trend.dto';
import { UpdateTrendDto } from './dto/update-trend.dto';

@Controller('trend')
export class TrendController {
  constructor(private readonly trendService: TrendService) {}
}
