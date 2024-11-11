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

// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
// import { BaseModel } from '../../common/entities/base.entity';
// import { UsersModel } from 'src/users/entities/users.entity';

// @Entity()
// export class FashionRecommendation extends BaseModel {
//   @ManyToOne(() => UsersModel)
//   user: UsersModel;

//   @Column()
//   summary: string;

//   @Column('text')
//   details: string;

//   @Column('simple-array')
//   keywords: string[];

//   @Column('simple-array')
//   related: string[];

//   @Column('json')
//   inputCriteria: Record<string, any>;
// }
