import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';

// TypeORM
import { TypeOrmModule } from '@nestjs/typeorm';

// entities
import { AuthModel } from 'src/auth/entities/auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuthModel])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
