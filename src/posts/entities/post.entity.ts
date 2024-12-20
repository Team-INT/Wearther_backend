import { ApiProperty } from '@nestjs/swagger';

import { Entity, Column, ManyToOne } from 'typeorm';

// entity
import { UsersModel } from 'src/users/entities/users.entity';
import { BaseModel } from 'src/common/entities/base.entity';

// '여러개'의 포스트는 '하나'의 유저가 작성할 수 있다.
@Entity()
export class PostsModel extends BaseModel {
  @ApiProperty({
    example: '햄깅이',
    description: '작성자',
  })
  @ManyToOne(() => UsersModel, (user) => user.posts, {
    nullable: false,
  })
  author: UsersModel;

  @ApiProperty({ example: '게시글 제목', description: '게시글의 제목' })
  @Column()
  title: string;

  @ApiProperty({ example: '게시글 내용', description: '게시글의 내용' })
  @Column('text')
  content: string;

  @ApiProperty({ example: 999, description: '좋아요 갯수' })
  @Column()
  likeCount: number;

  @ApiProperty({ example: 999, description: '댓글 갯수' })
  @Column()
  commentCounter: number;
}
