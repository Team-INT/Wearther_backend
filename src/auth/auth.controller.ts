import { Controller, Post, Body, Headers, UseGuards } from '@nestjs/common';

// service
import { AuthService } from './auth.service';

// swagger
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

// dto
import { RegisterUserDto } from './dto/register-user.dto';

// Guard
import { BasicTokenGuard } from './guards/basic-token.guard';
import { AccessTokenGuard, RefreshTokenGuard } from './guards/bearer-token.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 이메일을 통한 로그인 처리 엔드포인트
   *
   * @param rawToken - 요청 헤더에서 받은 인증 토큰 (Base64 인코딩된 이메일:패스워드 형태)
   * @returns 로그인 결과 (액세스 토큰 및 리프레시 토큰)
   */
  @ApiOperation({ summary: '로그인' })
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
    schema: {
      example: { statusCode: 401, message: '인증 실패', error: 'Unauthorized' },
    },
  })
  @UseGuards(BasicTokenGuard)
  @Post('login/email')
  postLoginEmail(@Headers('authorization') rawToken: string) {
    // 헤더에서 토큰 추출 후 디코딩하여 이메일과 비밀번호를 얻음
    const token = this.authService.extractTokenFromHeader(rawToken, false);
    const credentials = this.authService.decodeBasicToken(token);

    // 추출한 이메일과 비밀번호로 로그인 진행
    return this.authService.loginWithEmail(credentials);
  }

  // 추후 회원가입 로직 구현 예정
  /**
   * 이메일을 통한 회원가입 엔드포인트
   *
   * @param username - 사용자 이름
   * @param email - 사용자 이메일
   * @param password - 사용자 비밀번호
   */
  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({
    status: 200,
    description: '회원가입 성공',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
    schema: {
      example: { statusCode: 401, message: '인증 실패', error: 'Unauthorized' },
    },
  })
  @ApiBody({
    description: '회원가입을 위한 사용자 정보',
    schema: {
      type: 'object',

      properties: {
        username: { type: 'string', example: 'john_doe' },
        email: { type: 'string', example: 'john.doe@example.com' },
        password: { type: 'string', example: 'password123' },
      },
      required: ['username', 'email', 'password'],
    },
  })
  @Post('register/email')
  postRegisterEmail(@Body() body: RegisterUserDto) {
    return this.authService.registerWithEmail(body);
  }

  /**
   * 액세스 토큰 갱신 엔드포인트
   *
   * @param rawToken - 요청 헤더에서 받은 리프레시 토큰
   * @returns 새로운 액세스 토큰
   */
  @ApiOperation({ summary: '액세스 토큰 갱신' })
  @ApiResponse({
    status: 200,
    description: '액세스 토큰 갱신 성공',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
    schema: {
      example: { statusCode: 401, message: '인증 실패', error: 'Unauthorized' },
    },
  })
  @Post('token/access')
  @UseGuards(RefreshTokenGuard)
  postRefreshToken(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);
    const newToken = this.authService.rotateToken(token, false);

    return {
      accessToken: newToken,
    };
  }

  /**
   * 리프레시 토큰 갱신 엔드포인트
   *
   * @param rawToken - 요청 헤더에서 받은 액세스 토큰
   * @returns 새로운 리프레시 토큰
   */
  @ApiOperation({ summary: '리프레시 토큰 갱신' })
  @ApiResponse({
    status: 200,
    description: '리프레시 토큰 갱신 성공',
    schema: {
      example: {
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
    schema: {
      example: { statusCode: 401, message: '인증 실패', error: 'Unauthorized' },
    },
  })
  @Post('token/refresh')
  @UseGuards(AccessTokenGuard)
  postAccessToken(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);
    const newToken = this.authService.rotateToken(token, true);

    return {
      refreshToken: newToken,
    };
  }
}
