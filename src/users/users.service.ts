import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
  ) {}

  async getAllUsers() {
    return this.usersRepository.find();
  }

  async getUserByEmail(email: string): Promise<UsersModel | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async createUser(userData: CreateUserDto): Promise<UsersModel> {
    try {
      const existingUser = await this.getUserByEmail(userData.email);
      if (existingUser) {
        throw new ConflictException('이미 존재하는 이메일입니다.');
      }

      const newUser = this.usersRepository.create(userData);
      return await this.usersRepository.save(newUser);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      if (error.code === '23505') {
        throw new ConflictException('이미 존재하는 사용자입니다.');
      }

      console.error('Create user error:', error);
      throw new InternalServerErrorException('사용자 생성 중 오류가 발생했습니다.');
    }
  }

  async updateUser(id: number, updateData: Partial<UsersModel>) {
    const user = await this.usersRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const updatedUser = Object.assign(user, updateData);
    return this.usersRepository.save(updatedUser);
  }

  async deleteUser(id: number) {
    const user = await this.usersRepository.findOne({
      where: {
        id,
        isDeleted: true,
      },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    await this.usersRepository.save(user);
    return {
      message: '사용자가 성공적으로 삭제 되었습니다.',
    };
  }

  async getUserById(id: number): Promise<UsersModel | null> {
    return this.usersRepository.findOne({ where: { id } });
  }
}
