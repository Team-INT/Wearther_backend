import { Entity, Column, ManyToOne } from 'typeorm';

// entity
import { BaseModel } from 'src/common/entities/base.entity';
import { UsersModel } from 'src/users/entities/users.entity';

export class RecommendationModel extends BaseModel {
  @Column()
  input: string;

  @Column('text')
  result: string;

  // @ManyToOne(() => UsersModel, (user) => user.recommendations)
  // user: UsersModel;
}
