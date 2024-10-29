import { ApiProperty } from '@nestjs/swagger';

// TypeORM
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

export abstract class BaseModel {
  @ApiProperty({
    example: 1,
    description: 'Primary Key',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: '생성일시',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: '수정일시',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ example: false, description: '삭제 여부' })
  @Column({ default: false })
  isDeleted: boolean;
}
