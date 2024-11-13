import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersModel } from 'src/users/entities/users.entity';

/**
 * JWT 토큰의 페이로드 타입 정의
 * @property email - 사용자 이메일
 * @property sub - 사용자 ID (JWT 표준에서는 subject를 sub로 표현)
 * @property type - 토큰 유형 (access 또는 refresh)
 * @property iat - 토큰 발급 시간 (issued at)
 * @property exp - 토큰 만료 시간 (expiration)
 */
export interface TokenPayload {
  email: string;
  sub: number;
  type: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}

/**
 * 토큰 관련 작업을 처리하는 서비스
 */
@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 사용자 정보를 기반으로 JWT 토큰을 생성
   * @param user - 토큰에 포함될 사용자 정보
   * @param isRefreshToken - refresh 토큰 여부
   * @returns 생성된 JWT 토큰
   */
  signToken(user: Pick<UsersModel, 'email' | 'id'>, isRefreshToken: boolean): string {
    const payload: TokenPayload = {
      email: user.email,
      sub: user.id,
      type: isRefreshToken ? 'refresh' : 'access',
    };

    const expiresIn = isRefreshToken
      ? `${this.configService.get<number>('REFRESH_TOKEN_TIME', 1440)}m`
      : `${this.configService.get<number>('ACCESS_TOKEN_TIME', 60)}m`;

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn,
    });
  }

  /**
   * JWT 토큰을 검증하고 디코딩
   * @param token - 검증할 JWT 토큰
   * @returns 디코딩된 토큰 페이로드
   * @throws UnauthorizedException 토큰이 유효하지 않은 경우
   */
  verifyToken(token: string): TokenPayload {
    try {
      return this.jwtService.verify<TokenPayload>(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
    } catch (error) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
  }

  /**
   * Authorization 헤더에서 토큰을 추출
   * @param header - Authorization 헤더 값
   * @param isBearer - Bearer 토큰 여부 (false인 경우 Basic 토큰)
   * @returns 추출된 토큰
   * @throws UnauthorizedException 토큰 형식이 잘못된 경우
   */
  extractTokenFromHeader(header: string, isBearer: boolean): string {
    const splitToken = header.split(' ');
    const prefix = isBearer ? 'Bearer' : 'Basic';

    if (splitToken.length !== 2 || splitToken[0] !== prefix) {
      throw new UnauthorizedException('잘못된 토큰 형식입니다.');
    }

    return splitToken[1];
  }

  /**
   * 기존 토큰을 검증하고 새로운 토큰을 발급
   * @param token - 기존 토큰
   * @param isRefreshToken - 새로 발급할 토큰이 refresh 토큰인지 여부
   * @returns 새로 발급된 토큰
   */
  rotateToken(token: string, isRefreshToken: boolean): string {
    const decoded = this.verifyToken(token);
    return this.signToken({ email: decoded.email, id: decoded.sub }, isRefreshToken);
  }
}
