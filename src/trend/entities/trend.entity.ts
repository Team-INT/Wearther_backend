import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseModel } from 'src/common/entities/base.entity';

@Entity()
export class TrendModel extends BaseModel {
  @Column()
  date: Date;

  @Column()
  category: string;

  @Column()
  rank: number;

  @Column()
  keyword: string;
}
