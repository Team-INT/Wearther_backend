import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';

// TypeORM
import { TypeOrmModule } from '@nestjs/typeorm';

// entities
import { PostsModel } from './entities/post.entity';

// modules
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([PostsModel]), AuthModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
