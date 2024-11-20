import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { TokenService } from '../services/token.service';
import { AuthCredentialsService } from '../services/auth-credentials.service';

@Injectable()
export class BasicTokenGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly credentialsService: AuthCredentialsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const rawToken = request.headers.authorization;

    const token = this.tokenService.extractTokenFromHeader(rawToken, false);
    const credentials = this.credentialsService.decodeBasicToken(token);

    request.user = credentials;
    return true;
  }
}
