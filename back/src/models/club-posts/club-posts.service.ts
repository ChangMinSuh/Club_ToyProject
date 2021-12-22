import { Injectable } from '@nestjs/common';
import { CreateClubPostDto } from './dto/create-club-post.dto';
import { UpdateClubPostDto } from './dto/update-club-post.dto';

@Injectable()
export class ClubPostsService {
  create(createClubPostDto: CreateClubPostDto) {
    return 'This action adds a new clubPost';
  }

  findAll() {
    return `This action returns all clubPosts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} clubPost`;
  }

  update(id: number, updateClubPostDto: UpdateClubPostDto) {
    return `This action updates a #${id} clubPost`;
  }

  remove(id: number) {
    return `This action removes a #${id} clubPost`;
  }
}
