import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { BaseModel } from '../../common/entities/base.entity';
import { UsersModel } from 'src/users/entities/users.entity';

@Entity()
export class FashionRecommendation extends BaseModel {
  @ManyToOne(() => UsersModel)
  user: UsersModel;

  @Column()
  summary: string;

  @Column('text')
  details: string;

  @Column('simple-array')
  keywords: string[];

  @Column('simple-array')
  related: string[];

  @Column('json')
  inputCriteria: Record<string, any>;
}
