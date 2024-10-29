import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TrendService } from './trend.service';
import { CreateTrendDto } from './dto/create-trend.dto';
import { UpdateTrendDto } from './dto/update-trend.dto';

@Controller('trend')
export class TrendController {
  constructor(private readonly trendService: TrendService) {}

  @Post()
  create(@Body() createTrendDto: CreateTrendDto) {
    return this.trendService.create(createTrendDto);
  }

  @Get()
  findAll() {
    return this.trendService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trendService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTrendDto: UpdateTrendDto) {
    return this.trendService.update(+id, updateTrendDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trendService.remove(+id);
  }
}
