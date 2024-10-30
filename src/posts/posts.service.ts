import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostsModel } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsModel)
    private readonly postRepository: Repository<PostsModel>,
  ) {}

  getAllPosts() {
    return this.postRepository.find({
      relations: ['author'],
    });
  }

  getPostById(id: number) {
    const post = this.postRepository.findOne({
      where: {
        id,
      },
      relations: ['author'],
    });

    if (!post) throw new NotFoundException('해당 게시글을 찾을 수 없습니다.');

    return post;
  }

  async createPost(post: Pick<PostsModel, 'id' | 'title' | 'content'>) {
    const createPost = this.postRepository.create({
      ...post,
      author: {
        id: post.id,
      },
    });

    return await this.postRepository.save(createPost);
  }

  async updatePost(post: Pick<PostsModel, 'id' | 'title' | 'content'>) {
    const updatePost = await this.postRepository.findOne({
      ...post,
      where: {
        id: post.id,
      },
    });

    if (!updatePost) throw new NotFoundException('해당 게시글을 업데이트 할 수 없습니다.');

    if (post.title) updatePost.title = post.title;
    if (post.content) updatePost.content = post.content;

    return await this.postRepository.save(updatePost);
  }

  async deletePost(postId: number) {
    const post = await this.postRepository.findOne({
      where: {
        id: postId,
      },
    });

    if (!post) throw new NotFoundException('해당 게시글을 삭제할 수 없습니다.');

    return await this.postRepository.delete(postId);
  }
}
