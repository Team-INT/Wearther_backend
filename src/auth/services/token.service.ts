import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersModel } from 'src/users/entities/users.entity';

// TokenPayload를 export 합니다
export interface TokenPayload {
  email: string;
  sub: number;
  type: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  signToken(user: Pick<UsersModel, 'email' | 'id'>, isRefreshToken: boolean): string {
    const payload: TokenPayload = {
      email: user.email,
      sub: user.id,
      type: isRefreshToken ? 'refresh' : 'access',
    };

    return this.jwtService.sign(payload);
  }

  verifyToken(token: string): TokenPayload {
    try {
      const decoded = this.jwtService.verify<TokenPayload>(token);
      return decoded;
    } catch (error) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
  }

  extractTokenFromHeader(header: string, isBearer: boolean): string {
    const splitToken = header.split(' ');
    const prefix = isBearer ? 'Bearer' : 'Basic';

    if (splitToken.length !== 2 || splitToken[0] !== prefix) {
      throw new UnauthorizedException('잘못된 토큰 형식입니다.');
    }

    return splitToken[1];
  }

  rotateToken(token: string, isRefreshToken: boolean): string {
    const decoded = this.verifyToken(token);
    return this.signToken({ email: decoded.email, id: decoded.sub }, isRefreshToken);
  }
}
