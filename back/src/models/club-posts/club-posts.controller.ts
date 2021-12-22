import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ClubPostsService } from './club-posts.service';
import { CreateClubPostDto } from './dto/create-club-post.dto';
import { UpdateClubPostDto } from './dto/update-club-post.dto';

@Controller('club-posts')
export class ClubPostsController {
  constructor(private readonly clubPostsService: ClubPostsService) {}

  @Post()
  create(@Body() createClubPostDto: CreateClubPostDto) {
    return this.clubPostsService.create(createClubPostDto);
  }

  @Get()
  findAll() {
    return this.clubPostsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clubPostsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateClubPostDto: UpdateClubPostDto,
  ) {
    return this.clubPostsService.update(+id, updateClubPostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clubPostsService.remove(+id);
  }
}
