import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { UsersModel } from 'src/users/entities/users.entity';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthCredentialsService {
  constructor(private readonly usersService: UsersService) {}

  decodeBasicToken(base64String: string) {
    const decoded = Buffer.from(base64String, 'base64').toString('utf8');
    const split = decoded.split(':');

    if (split.length !== 2) {
      throw new UnauthorizedException('잘못된 유형의 토큰입니다.');
    }

    return {
      email: split[0],
      password: split[1],
    };
  }

  async validateUser(credentials: LoginDto) {
    const user = await this.usersService.getUserByEmail(credentials.email);
    if (!user) {
      throw new UnauthorizedException('존재하지 않는 사용자입니다.');
    }

    const passOk = await bcrypt.compare(credentials.password, user.password);
    if (!passOk) {
      throw new UnauthorizedException('비밀번호가 틀렸습니다.');
    }

    return user;
  }

  async hashPassword(password: string) {
    return bcrypt.hash(password, parseInt(process.env.HASH_ROUNDS));
  }
}
