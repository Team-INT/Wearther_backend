import { PickType } from '@nestjs/mapped-types';

// entity
import { PostsModel } from '../entities/post.entity';

export class CreatePostDto extends PickType(PostsModel, ['title', 'content']) {}
