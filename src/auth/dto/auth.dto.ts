import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class AuthBaseDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
