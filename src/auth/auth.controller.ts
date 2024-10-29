import { Controller, Post, Body, Headers } from '@nestjs/common';

// service
import { AuthService } from './auth.service';

// swagger
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '로그인' })
  @ApiResponse({ status: 200, description: '로그인 성공' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @Post('login/email')
  loginEmail(@Headers('authorization') rawToken: string) {}

  @Post('register/email')
  registerEmail(
    @Body('username') username: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {}
}
