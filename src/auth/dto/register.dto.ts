import { IsString, MaxLength } from 'class-validator';
import { AuthBaseDto } from './auth.dto';

export class RegisterDto extends AuthBaseDto {
  @IsString()
  @MaxLength(12)
  username: string;
}
