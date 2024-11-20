// dto/login.dto.ts
import { PickType } from '@nestjs/mapped-types';
import { UsersModel } from 'src/users/entities/users.entity';
import { IsNotEmpty } from 'class-validator';

export class LoginDto extends PickType(UsersModel, ['email', 'password'] as const) {
  email: string;

  @IsNotEmpty()
  password: string;
}
