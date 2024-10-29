import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostModel } from './entities/post.entity';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getPosts() {
    return this.postsService.getAllPosts();
  }

  @Get(':id')
  getPost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPostById(id);
  }

  @Post()
  createPosts(createPostDto: Pick<PostModel, 'id' | 'title' | 'content'>) {
    return this.postsService.createPost(createPostDto);
  }

  @Patch(':id')
  patchPost(UpdatePostDto: Pick<PostModel, 'id' | 'title' | 'content'>) {
    return this.postsService.updatePost(UpdatePostDto);
  }

  @Delete(':id')
  deletePost(@Param(':id', ParseIntPipe) id: number) {
    return this.postsService.deletePost(id);
  }
}
