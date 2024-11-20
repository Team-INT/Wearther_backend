import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TokenService } from './services/token.service';
import { AuthCredentialsService } from './services/auth-credentials.service';
import { UsersModule } from '../users/users.module';

/**
 * 인증 관련 기능을 제공하는 모듈
 * JWT 인증, 사용자 인증, 토큰 관리 등을 처리
 */
@Module({
  imports: [
    // Passport 기본 전략을 JWT로 설정
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // JWT 모듈 설정
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get<number>('ACCESS_TOKEN_TIME', 60)}m`,
        },
      }),
    }),
    // 사용자 정보 조회를 위한 UsersModule
    UsersModule,
  ],
  // 제공할 서비스들
  providers: [
    AuthService, // 인증 관련 핵심 서비스
    TokenService, // 토큰 관리 서비스
    AuthCredentialsService, // 인증 정보 처리 서비스
  ],
  controllers: [AuthController],
  // 다른 모듈에서 사용할 수 있도록 export
  exports: [AuthService, TokenService],
})
export class AuthModule {}
