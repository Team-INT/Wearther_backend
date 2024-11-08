import { Controller, Get, Param, UseGuards } from '@nestjs/common';

// guard
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

// serivce
import { UsersService } from './users.service';

// swagger
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('User')
// @ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '전체 유저 조회' })
  @ApiResponse({ status: 200, description: '프로필 조회 성공' })
  @Get()
  getUsers() {
    return this.usersService.getAllUsers();
  }

  @ApiOperation({ summary: '이메일로 유저 조회' })
  @ApiResponse({
    status: 200,
    description: '유저 조회 성공',
    schema: {
      example: {
        id: 1,
        email: 'example@example.com',
        username: 'john_doe',
        createdAt: '2024-10-31T20:46:39.217Z',
        updatedAt: '2024-10-31T20:46:39.217Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '유저를 찾을 수 없음',
    schema: {
      example: {
        statusCode: 404,
        message: '유저를 찾을 수 없습니다.',
        error: 'Not Found',
      },
    },
  })
  @ApiParam({
    name: 'email',
    description: '조회할 유저의 이메일',
    required: true,
    example: 'example@example.com',
  })
  @Get(':email')
  getUser(@Param('email') email: string) {
    return this.usersService.getUserByEmail(email);
  }
}
