import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class WeatherModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float')
  temperature: number;

  @Column('float')
  feels_like: number;

  @Column('float')
  temp_min: number;

  @Column('float')
  temp_max: number;

  @Column('int')
  pressure: number;

  @Column('int')
  humidity: number;

  @Column('int')
  clouds: number;

  @Column('float')
  wind_speed: number;

  @Column('int')
  wind_deg: number;

  @Column('timestamp')
  timestamp: Date;

  @Column('varchar', { length: 10 })
  time_of_day: string; // 오전, 오후 구분 용도
}
