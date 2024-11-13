import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { TokenService } from './services/token.service';
import { AuthCredentialsService } from './services/auth-credentials.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UsersModel } from 'src/users/entities/users.entity';

/**
 * 인증 관련 핵심 비즈니스 로직을 처리하는 서비스
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly credentialsService: AuthCredentialsService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * 사용자 정보를 기반으로 인증 토큰들을 생성
   * @param user - 토큰에 포함될 사용자 정보
   * @returns 생성된 토큰들과 사용자 정보
   */
  generateAuthTokens(user: Pick<UsersModel, 'email' | 'id' | 'username'>) {
    return {
      userId: user.id,
      userEmail: user.email,
      username: user.username,
      accessToken: this.tokenService.signToken(user, false),
      refreshToken: this.tokenService.signToken(user, true),
    };
  }

  /**
   * 이메일 로그인 처리
   * @param credentials - 이메일과 비밀번호
   * @returns 인증 토큰들과 사용자 정보
   */
  async loginWithEmail(credentials: Pick<UsersModel, 'email' | 'password'>) {
    const user = await this.credentialsService.validateUser(credentials);
    return this.generateAuthTokens(user);
  }

  /**
   * 이메일 회원가입 처리
   * @param userData - 회원가입 정보
   * @returns 인증 토큰들과 사용자 정보
   */
  async registerWithEmail(userData: RegisterUserDto) {
    const hashedPassword = await this.credentialsService.hashPassword(userData.password);
    const newUser = await this.usersService.createUser({
      ...userData,
      password: hashedPassword,
    });

    return this.generateAuthTokens(newUser);
  }
}
