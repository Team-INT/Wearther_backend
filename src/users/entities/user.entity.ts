import { Column, Entity, OneToMany } from 'typeorm';

// entity
import { PostModel } from 'src/posts/entities/post.entity';
import { BaseModel } from 'src/common/entities/base.entity';

// constants
import { RolesEnum } from '../constants/user.const';

// swagger
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';

@Entity()
export class UserModel extends BaseModel {
  @ApiProperty({ example: '햄깅이', description: '닉네임' })
  @Column({
    length: 12,
    unique: true,
  })
  username: string;

  @ApiProperty({ example: 'user@example.com', description: '이메일 주소' })
  @Column({
    unique: true,
  })
  email: string;

  @ApiHideProperty()
  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Object.values(RolesEnum),
    default: RolesEnum.USER,
  })
  role: RolesEnum;

  @OneToMany(() => PostModel, (post) => post.author, { cascade: true })
  posts: PostModel[];
}
