import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

// constants
import { ENV_JWT_SECRET_KEY } from 'src/common/constant/env-keys.const';

// users
import { UsersModel } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';

// dto
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 주어진 사용자 정보를 이용해 JWT 토큰을 생성
   *
   * @param user - 토큰에 포함할 사용자 정보 (email, id)
   * @param isRefreshToken - 리프레시 토큰 여부
   * @returns 서명된 JWT 토큰
   */
  signToken(user: Pick<UsersModel, 'email' | 'id'>, isRefreshToken: boolean) {
    // 토큰에 포함될 페이로드 정보 설정
    const payload = {
      email: user.email,
      sub: user.id,
      type: isRefreshToken ? 'refresh' : 'access',
    };

    // 토큰 생성 및 반환
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: isRefreshToken
        ? parseInt(process.env.REFRESH_TOKEN_TIME) * 60
        : parseInt(process.env.ACCESS_TOKEN_TIME) * 60,
    });
  }

  /**
   * 사용자가 로그인에 성공할 경우 액세스 및 리프레시 토큰을 반환
   *
   * @param user - 사용자 정보 (email, id)
   * @returns 액세스 토큰 및 리프레시 토큰
   */
  loginUser(user: Pick<UsersModel, 'username' | 'email' | 'id'>) {
    return {
      userId: user.id,
      userEmail: user.email,
      userName: user.username,
      accessToken: this.signToken(user, false),
      refreshToken: this.signToken(user, true),
    };
  }

  /**
   * 이메일과 비밀번호를 사용하여 사용자를 인증
   *
   * @param user - 사용자 정보 (email, password)
   * @returns 인증된 사용자 정보
   * @throws UnauthorizedException - 사용자가 존재하지 않거나 비밀번호가 틀린 경우
   */
  async authenticateWithEmailAndPassword(user: Pick<UsersModel, 'email' | 'password'>) {
    // 이메일로 사용자 검색
    const existingUser = await this.usersService.getUserByEmail(user.email);

    if (!existingUser) {
      throw new UnauthorizedException('존재하지 않는 사용자 입니다.');
    }

    // 해시된 비밀번호 비교
    const passOk = await bcrypt.compare(user.password, existingUser.password);

    if (!passOk) {
      throw new UnauthorizedException('비밀번호가 틀렸습니다.');
    }

    return existingUser;
  }

  /**
   * 이메일과 비밀번호를 사용하여 로그인 처리
   *
   * @param user - 사용자 정보 (email, password)
   * @returns 로그인 성공 시 액세스 및 리프레시 토큰 반환
   */
  async loginWithEmail(user: Pick<UsersModel, 'email' | 'password'>) {
    // 사용자 인증 후 로그인 진행
    const existingUser = await this.authenticateWithEmailAndPassword(user);
    return this.loginUser(existingUser);
  }

  /**
   * 이메일을 통한 회원가입 처리
   *
   * @param user - 사용자 정보 (username, email, password)
   * @returns 회원가입 성공 시 액세스 및 리프레시 토큰 반환
   */
  async registerWithEmail(user: RegisterUserDto) {
    const hash = await bcrypt.hash(user.password, parseInt(process.env.HASH_ROUNDS));
    const newUser = await this.usersService.createUser({
      ...user,
      password: hash,
    });

    return this.loginUser(newUser);
  }

  /**
   * 요청 헤더에서 토큰을 추출하는 메서드
   *
   * @param header - 인증 헤더 (예: 'Basic {token}' 또는 'Bearer {token}')
   * @param isBearer - Bearer 토큰 여부 (true인 경우 Bearer, false인 경우 Basic)
   * @returns 추출된 토큰 문자열
   * @throws UnauthorizedException - 잘못된 토큰 형식인 경우
   */
  extractTokenFromHeader(header: string, isBearer: boolean) {
    const splitToken = header.split(' ');
    const prefix: 'Bearer' | 'Basic' = isBearer ? 'Bearer' : 'Basic';

    if (splitToken.length !== 2 || splitToken[0] !== prefix) {
      throw new UnauthorizedException('Bearer나 Basic이 아니거나 잘못된 형식의 토큰입니다.');
    }

    const token = splitToken[1];
    return token;
  }

  /**
   * Base64로 인코딩된 Basic 인증 토큰을 디코딩하여 이메일과 비밀번호를 추출
   *
   * @param base64String - Base64로 인코딩된 문자열 (예: 'email:password')
   * @returns 디코딩된 이메일 및 비밀번호 정보
   * @throws UnauthorizedException - 잘못된 토큰 형식인 경우
   */
  decodeBasicToken(base64String: string) {
    const decoded = Buffer.from(base64String, 'base64').toString('utf8');
    const split = decoded.split(':');

    if (split.length !== 2) {
      throw new UnauthorizedException('잘못된 유형의 토큰입니다.');
    }

    const email = split[0];
    const password = split[1];

    return {
      email,
      password,
    };
  }

  veryfiyToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>(ENV_JWT_SECRET_KEY),
      });
    } catch (error) {
      throw new UnauthorizedException('토큰이 만료됐거나 잘못된 토큰입니다.');
    }
  }

  rotateToken(token: string, isRefreshToken: boolean) {
    const decoded = this.jwtService.verify(token, {
      secret: this.configService.get<string>(ENV_JWT_SECRET_KEY),
      complete: true,
    });

    /**
     * sub: id
     * email: email
     * type: 'access' | 'refresh'
     */

    if (decoded.type !== 'refresh') {
      throw new UnauthorizedException('토큰 재발급은 Refresh 토큰으로만 가능합니다.');
    }

    return this.signToken(
      {
        ...decoded,
      },
      isRefreshToken,
    );
  }
}
