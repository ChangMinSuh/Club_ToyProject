import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostBody } from './dto/create-post.dto';
import { UpdatePostBody } from './dto/update-post.dto';
import { ClubPosts } from './entities/club-posts.entity';

@Injectable()
export class ClubPostsService {
  constructor(
    @InjectRepository(ClubPosts)
    private readonly clubPostsRepository: Repository<ClubPosts>,
  ) {}

  async createPost(
    clubId: number,
    clubMemberId: number,
    body: CreatePostBody,
  ): Promise<void> {
    const clubPost = new ClubPosts();
    clubPost.title = body.title;
    clubPost.content = body.content;
    clubPost.ClubId = clubId;
    clubPost.ClubMemberId = clubMemberId;
    await this.clubPostsRepository.save(clubPost);
    return;
  }

  async findAllPosts(clubId: number): Promise<ClubPosts[]> {
    const result = await this.clubPostsRepository.find({
      where: { ClubId: clubId },
      relations: ['ClubMember'],
    });
    return result;
  }

  async findPost(postId: number): Promise<ClubPosts> {
    const result = await this.clubPostsRepository.findOne({
      where: { id: postId },
      relations: ['ClubMember'],
    });
    return result;
  }

  async updatePost(postId: number, body: UpdatePostBody): Promise<void> {
    const clubPost = await this.clubPostsRepository.findOne({
      where: { id: postId },
    });
    clubPost.title = body.title;
    clubPost.content = body.content;
    await this.clubPostsRepository.save(clubPost);
    return;
  }

  async removePost(postId: number): Promise<void> {
    const clubPost = await this.clubPostsRepository.findOne({
      where: { id: postId },
    });
    await this.clubPostsRepository.remove(clubPost);
    return;
  }
}
