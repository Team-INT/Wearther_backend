import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { TokenService } from './services/token.service';
import { AuthCredentialsService } from './services/auth-credentials.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UsersModel } from 'src/users/entities/users.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly credentialsService: AuthCredentialsService,
    private readonly usersService: UsersService,
  ) {}

  generateAuthTokens(user: Pick<UsersModel, 'email' | 'id' | 'username'>) {
    return {
      userId: user.id,
      userEmail: user.email,
      username: user.username,
      accessToken: this.tokenService.signToken(user, false),
      refreshToken: this.tokenService.signToken(user, true),
    };
  }

  async loginWithEmail(credentials: Pick<UsersModel, 'email' | 'password'>) {
    const user = await this.credentialsService.validateUser(credentials);
    return this.generateAuthTokens(user);
  }

  async registerWithEmail(userData: RegisterUserDto) {
    const hashedPassword = await this.credentialsService.hashPassword(userData.password);
    const newUser = await this.usersService.createUser({
      ...userData,
      password: hashedPassword,
    });

    return this.generateAuthTokens(newUser);
  }
}
