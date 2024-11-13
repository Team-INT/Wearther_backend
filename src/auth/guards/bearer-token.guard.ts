import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { TokenService, TokenPayload } from '../services/token.service';

@Injectable()
export class BearerTokenGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const rawToken = request.headers.authorization;

    const token = this.tokenService.extractTokenFromHeader(rawToken, true);
    const payload = this.tokenService.verifyToken(token);

    if (this instanceof RefreshTokenGuard && payload.type !== 'refresh') {
      throw new UnauthorizedException('Refresh 토큰이 아닙니다.');
    }

    if (this instanceof AccessTokenGuard && payload.type !== 'access') {
      throw new UnauthorizedException('Access 토큰이 아닙니다.');
    }

    request.user = payload;
    return true;
  }
}

@Injectable()
export class AccessTokenGuard extends BearerTokenGuard {}

@Injectable()
export class RefreshTokenGuard extends BearerTokenGuard {}
