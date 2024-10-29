import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';

// TypeORM
import { TypeOrmModule } from '@nestjs/typeorm';

// entities
import { PostModel } from './entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostModel])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
