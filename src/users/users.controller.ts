import { Controller, Get, UseGuards, Body, Patch, Delete } from '@nestjs/common';

// guard
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/auth/decorators/user.decorator';

// service
import { UsersService } from './users.service';

// swagger
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { UsersModel } from './entities/users.entity';

@ApiTags('User')
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '내 정보 조회' })
  @ApiResponse({
    status: 200,
    description: '내 정보 조회 성공',
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
    status: 401,
    description: '인증 실패',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {JWT_TOKEN}',
    required: true,
  })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyProfile(@User() user) {
    return this.usersService.getUserById(user.id);
  }

  @ApiOperation({ summary: '내 정보 수정' })
  @ApiResponse({ 
    status: 200, 
    description: '정보 수정 성공',
    schema: {
      example: {
        id: 1,
        email: 'updated@example.com',
        username: 'updated_name',
        createdAt: '2024-10-31T20:46:39.217Z',
        updatedAt: '2024-10-31T20:46:39.217Z',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {JWT_TOKEN}',
    required: true,
  })
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMyProfile(@User() user, @Body() updateData: Partial<UsersModel>) {
    return this.usersService.updateUser(user.id, updateData);
  }

  @ApiOperation({ summary: '회원 탈퇴' })
  @ApiResponse({ 
    status: 200, 
    description: '회원 탈퇴 성공',
    schema: {
      example: {
        message: '사용자가 성공적으로 삭제 되었습니다.',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {JWT_TOKEN}',
    required: true,
  })
  @UseGuards(JwtAuthGuard)
  @Delete('me')
  deleteMyAccount(@User() user) {
    return this.usersService.deleteUser(user.id);
  }
}
