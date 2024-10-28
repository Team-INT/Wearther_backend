import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// users
import { UserModel } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  signToken(user: Pick<UserModel, 'email' | 'id'>, isRefreshToken: boolean) {
    /**
     * Payload에 들어갈 정보
     * 1) email
     * 2) sub -> id
     * 3) type: 'access' | 'refresh'
     *
     */

    const payload = {
      email: user.email,
      sub: user.id,
      type: isRefreshToken ? 'refresh' : 'access',
    };

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: isRefreshToken
        ? parseInt(process.env.REFRESH_TOKEN_TIME) * 60
        : parseInt(process.env.ACCESS_TOKEN_TIME) * 60,
    });
  }

  loginUser(user: Pick<UserModel, 'email' | 'id'>) {
    return {
      accessToken: this.signToken(user, false),
      refreshToken: this.signToken(user, true),
    };
  }

  /**
   * 1) 사용자가 존재하는지 확인(email)
   * 2) 비밀번호가 맞는지 확인(pasword - hash키 비교)
   * 3) 모두 통과되는 사용자 정보 반환
   */

  async authenticateWithEmailAndPassword(
    user: Pick<UserModel, 'email' | 'password'>,
  ) {}

  async loginWithEmail() {}

  async registerWithEmail() {}

  /**
   *
   * Header로 부터 토큰을 받을 때
   * {authorization: 'Basic {token}'}
   * {authorization: 'Bearer {token}'}
   */

  extractTokenFromHeader() {}
  /**
   * Basic adsklfjadlsfjkladsjklf -> email:password
   * 1) adsklfjadlsfjkladsjklf;
   * 2) email:password -> [email, password]
   * 3) {email: eamil, password: password}
   */
  decodeBasicToken() {}
}
