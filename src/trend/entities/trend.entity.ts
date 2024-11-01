import { Entity, Column } from 'typeorm';
import { BaseModel } from 'src/common/entities/base.entity';

@Entity()
export class TrendModel extends BaseModel {
  @Column()
  date: Date;

  @Column()
  category_name: string;

  @Column()
  category_param: string;

  @Column()
  device: string;

  @Column()
  gender: string;

  @Column()
  age_group: string;

  @Column('float')
  value: number;
}
