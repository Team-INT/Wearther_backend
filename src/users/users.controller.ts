import { Controller, Get, UseGuards } from '@nestjs/common';

// guard
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

// serivce
import { UsersService } from './users.service';

// swagger
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '전체 유저 조회' })
  @ApiResponse({ status: 200, description: '프로필 조회 성공' })
  @UseGuards(JwtAuthGuard)
  @Get()
  getUsers() {
    return this.usersService.getAllUsers();
  }
}
