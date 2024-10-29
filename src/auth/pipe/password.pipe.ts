import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class PasswordPipe implements PipeTransform {
  transform(value: any) {
    if (value.toString().length > 24) {
      throw new BadRequestException('비밀번호는 24자 이하로 입력해주세요.');
    }

    return value.toString();
  }
}
