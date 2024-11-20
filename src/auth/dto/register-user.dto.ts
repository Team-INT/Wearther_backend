// dto/register-user.dto.ts
import { PickType } from '@nestjs/mapped-types';
import { UsersModel } from 'src/users/entities/users.entity';
import { IsNotEmpty } from 'class-validator';

export class RegisterUserDto extends PickType(UsersModel, [
  'username',
  'email',
  'password',
] as const) {
  @IsNotEmpty()
  password: string;
}
