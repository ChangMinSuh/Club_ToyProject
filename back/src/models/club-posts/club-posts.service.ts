import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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
    clubPost.showStatus = body.showStatus;
    clubPost.ClubId = clubId;
    clubPost.ClubMemberId = clubMemberId;
    await this.clubPostsRepository.save(clubPost);
    return;
  }

  async findAllPosts(clubId: number, showStatus: string): Promise<ClubPosts[]> {
    const showStatusArr = showStatus.split(',');
    const result = await this.clubPostsRepository.find({
      where: { ClubId: clubId, showStatus: In(showStatusArr) },
      relations: ['ClubMember'],
      order: {
        createdAt: 'DESC',
      },
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
    clubPost.showStatus = body.showStatus;
    if (body.createdAt) clubPost.createdAt = body.createdAt;
    clubPost.updatedAt = body.updatedAt;

    await this.clubPostsRepository.save(clubPost);
    return;
  }

  async removePost(postId: number): Promise<void> {
    const clubPost = await this.clubPostsRepository.findOne({
      where: { id: postId },
    });
    if (!clubPost) {
      throw new ConflictException('db에 존재하지 않습니다.');
    }
    await this.clubPostsRepository.remove(clubPost);
    return;
  }
}
