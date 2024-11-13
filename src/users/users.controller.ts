import { Controller, Get, UseGuards, Body, Patch, Delete } from '@nestjs/common';

// guard
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/auth/decorators/user.decorator';

// service
import { UsersService } from './users.service';

// swagger
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersModel } from './entities/users.entity';

@ApiTags('User')
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
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyProfile(@User() user) {
    return this.usersService.getUserById(user.id);
  }

  @ApiOperation({ summary: '내 정보 수정' })
  @ApiResponse({ status: 200, description: '정보 수정 성공' })
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMyProfile(@User() user, @Body() updateData: Partial<UsersModel>) {
    return this.usersService.updateUser(user.id, updateData);
  }

  @ApiOperation({ summary: '회원 탈퇴' })
  @ApiResponse({ status: 200, description: '회원 탈퇴 성공' })
  @UseGuards(JwtAuthGuard)
  @Delete('me')
  deleteMyAccount(@User() user) {
    return this.usersService.deleteUser(user.id);
  }
}
