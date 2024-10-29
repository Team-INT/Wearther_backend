import { Entity, Column, ManyToOne } from 'typeorm';

// entity
import { BaseModel } from 'src/common/entities/base.entity';
import { UserModel } from 'src/users/entities/user.entity';

export class RecommendationModel extends BaseModel {
  @Column()
  input: string;

  @Column('text')
  result: string;

  // @ManyToOne(() => UserModel, (user) => user.recommendations)
  // user: UserModel;
}
