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
}
