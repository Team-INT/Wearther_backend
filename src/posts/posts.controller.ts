import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { PostsService } from './posts.service';
import { PostsModel } from './entities/post.entity';

// entity
import { UsersModel } from 'src/users/entities/users.entity';

// custom-decorator
import { User } from 'src/users/decorator/user.decorator';

// dto
import { CreatePostDto } from './dto/create-post.dto';

// guard
import { AccessTokenGuard } from 'src/auth/guards/bearer-token.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getPosts(): Promise<PostsModel[]> {
    return this.postsService.getAllPosts();
  }

  @Get(':id')
  getPost(@Param('id', ParseIntPipe) id: number): Promise<PostsModel> {
    return this.postsService.getPostById(id);
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  createPosts(@User() user: UsersModel, @Body() createPostDto: CreatePostDto) {
    return this.postsService.createPost(user.id, createPostDto);
  }

  @Patch(':id')
  patchPost(UpdatePostDto: Pick<PostsModel, 'id' | 'title' | 'content'>): Promise<PostsModel> {
    return this.postsService.updatePost(UpdatePostDto);
  }

  @Delete(':id')
  deletePost(@Param(':id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.postsService.deletePost(id);
  }
}
