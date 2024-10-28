import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserModel)
    private readonly usersRepository: Repository<UserModel>,
  ) {}

  async createUser(user: Pick<UserModel, 'username' | 'email' | 'password'>) {
    const usernameExists = await this.usersRepository.exists({
      where: {
        username: user.username,
      },
    });

    if (usernameExists) {
      throw new BadRequestException('이미 존재하는 별명입니다.');
    }

    const emailExists = await this.usersRepository.exists({
      where: {
        email: user.email,
      },
    });

    if (emailExists) {
      throw new BadRequestException('이미 존재하는 이메일 입니다.');
    }

    const userObject = this.usersRepository.create({
      username: user.username,
      email: user.email,
      password: user.password,
    });

    const newUser = await this.usersRepository.save(userObject);

    return newUser;
  }

  async getAllUsers() {}

  async getUserByEmail() {}
}
