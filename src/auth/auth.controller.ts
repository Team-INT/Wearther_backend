import {
  Controller,
  Post,
  Body,
  Headers,
  UseGuards,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

// services
import { AuthService } from './auth.service';
import { TokenService } from './services/token.service';
import { AuthCredentialsService } from './services/auth-credentials.service';

// dto
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';

// guards
import { BasicTokenGuard } from './guards/basic-token.guard';
import { AccessTokenGuard, RefreshTokenGuard } from './guards/bearer-token.guard';

// responses
import { AuthResponseDto } from './dto/auth-response.dto';
import { TokenResponseDto } from './dto/token-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private readonly credentialsService: AuthCredentialsService,
  ) {}

  @ApiOperation({
    summary: '이메일 로그인',
  })
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
  })
  @ApiBody({ type: LoginDto })
  // @UseGuards(BasicTokenGuard)
  @Post('login/email')
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.loginWithEmail(loginDto).then((response) => ({
      ...response,
      email: response.userEmail,
    }));
  }

  @ApiOperation({
    summary: '회원가입',
  })
  @ApiResponse({
    status: 201,
    description: '회원가입 성공',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: '회원가입 처리 중 오류가 발생했습니다.',
  })
  @ApiBody({ type: RegisterUserDto })
  @Post('register/email')
  async register(@Body() registerDto: RegisterUserDto): Promise<AuthResponseDto> {
    try {
      const response = await this.authService.registerWithEmail(registerDto);
      return {
        ...response,
        email: response.userEmail,
      };
    } catch (error) {
      console.error('Registration error:', error);

      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new InternalServerErrorException(
        error.message || '회원가입 처리 중 오류가 발생했습니다.',
      );
    }
  }

  @ApiOperation({
    summary: '액세스 토큰 갱신',
  })
  @ApiResponse({
    status: 200,
    description: '토큰 갱신 성공',
    type: TokenResponseDto,
  })
  @ApiBearerAuth('access-token')
  @UseGuards(RefreshTokenGuard)
  @Post('token/access')
  async refreshAccessToken(@Headers('authorization') rawToken: string): Promise<TokenResponseDto> {
    const token = this.tokenService.extractTokenFromHeader(rawToken, true);
    const accessToken = this.tokenService.rotateToken(token, false);

    return { accessToken };
  }

  @ApiOperation({
    summary: '리프레시 토큰 갱신',
  })
  @ApiResponse({
    status: 200,
    description: '토큰 갱신 성공',
    type: TokenResponseDto,
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard)
  @Post('token/refresh')
  async refreshRefreshToken(@Headers('authorization') rawToken: string): Promise<TokenResponseDto> {
    const token = this.tokenService.extractTokenFromHeader(rawToken, true);
    const refreshToken = this.tokenService.rotateToken(token, true);

    return { refreshToken };
  }
}
