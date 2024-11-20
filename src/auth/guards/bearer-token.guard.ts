import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { TokenService, TokenPayload } from '../services/token.service';

/**
 * Bearer 토큰 인증을 처리하는 기본 가드
 * Access 토큰과 Refresh 토큰 가드의 기본 클래스
 */
@Injectable()
export class BearerTokenGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  /**
   * 요청에 포함된 Bearer 토큰을 검증
   * @param context - 실행 컨텍스트
   * @returns 인증 성공 여부
   * @throws UnauthorizedException 토큰이 유효하지 않거나 잘못된 타입인 경우
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const rawToken = request.headers.authorization;

    // 헤더에서 토큰 추출
    const token = this.tokenService.extractTokenFromHeader(rawToken, true);
    // 토큰 검증 및 디코딩
    const payload = this.tokenService.verifyToken(token);

    // 토큰 타입 검증
    if (this instanceof RefreshTokenGuard && payload.type !== 'refresh') {
      throw new UnauthorizedException('Refresh 토큰이 아닙니다.');
    }

    if (this instanceof AccessTokenGuard && payload.type !== 'access') {
      throw new UnauthorizedException('Access 토큰이 아닙니다.');
    }

    // 검증된 페이로드를 요청 객체에 저장
    request.user = payload;
    return true;
  }
}

/**
 * Access 토큰 전용 가드
 */
@Injectable()
export class AccessTokenGuard extends BearerTokenGuard {}

/**
 * Refresh 토큰 전용 가드
 */
@Injectable()
export class RefreshTokenGuard extends BearerTokenGuard {}
