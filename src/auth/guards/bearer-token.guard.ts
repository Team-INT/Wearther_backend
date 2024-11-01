import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class BearerTokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const rawToken = request.headers['authorization'];

    if (!rawToken) {
      throw new UnauthorizedException('Bearer 토큰이 존재하지 않습니다.');
    }

    const token = this.authService.extractTokenFromHeader(rawToken, true);
    const result = this.authService.veryfiyToken(token);
    const user = await this.usersService.getUserByEmail(result.email);

    /**
     * 1. user 정보
     * 2. token(request에 들어가는 토큰)
     * 3. tokenType - access | refresh
     */
    try {
      request.user = user;
      request.token = token;
      request.tokenType = result.type;
    } catch (error) {
      throw new UnauthorizedException('Bearer 토큰 인증에 실패하였습니다.');
    }
    return true;
  }
}

@Injectable()
export class AccessTokenGuard extends BearerTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const request = context.switchToHttp().getRequest();

    if (request.tokenType !== 'access') {
      throw new UnauthorizedException('access 토큰이 아닙니다.');
    }

    return true;
  }
}

@Injectable()
export class RefreshTokenGuard extends BearerTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const request = context.switchToHttp().getRequest();

    if (request.tokenType !== 'refresh') {
      throw new UnauthorizedException('refresh 토큰이 아닙니다.');
    }

    return true;
  }
}
