import { Column, Entity, OneToMany } from 'typeorm';

// validation
import { IsEmail, IsString, Length } from 'class-validator';
import { lengthValidationMessage } from 'src/common/validations/length-validation.message';
import { stringValidationMessage } from 'src/common/validations/string-validation.message';

// entity
import { PostsModel } from 'src/posts/entities/post.entity';
import { BaseModel } from 'src/common/entities/base.entity';

// constants
import { RolesEnum } from '../constants/user.const';

// swagger
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { emailValidationMessage } from 'src/common/validations/email-validation.message';
import { Exclude } from 'class-transformer';

@Entity()
export class UsersModel extends BaseModel {
  @ApiProperty({ example: '햄깅이', description: '닉네임' })
  @Column({
    length: 12,
    unique: true,
  })
  @IsString({
    message: stringValidationMessage,
  })
  @Length(1, 12, {
    message: lengthValidationMessage,
  })
  username: string;

  @ApiProperty({ example: 'user@example.com', description: '이메일 주소' })
  @Column({
    unique: true,
  })
  @IsEmail({}, { message: emailValidationMessage })
  email: string;

  @ApiHideProperty()
  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({
    type: 'enum',
    enum: Object.values(RolesEnum),
    default: RolesEnum.USER,
  })
  role: RolesEnum;

  @OneToMany(() => PostsModel, (post) => post.author, { cascade: true })
  posts: PostsModel[];
}
