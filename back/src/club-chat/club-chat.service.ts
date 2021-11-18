import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClubChats } from 'src/entities/clubChats';
import { Clubs } from 'src/entities/clubs';
import { Repository } from 'typeorm';

@Injectable()
export class ClubChatService {
  constructor(
    @InjectRepository(Clubs)
    private readonly repositoryClubs: Repository<Clubs>,
    @InjectRepository(ClubChats)
    private readonly repositoryClubChats: Repository<ClubChats>,
  ) {}

  async setClubChat(data) {
    const clubChat = new ClubChats();
    clubChat.content = data.content;
    clubChat.UserId = data.UserId;
    clubChat.ClubId = data.ClubId;
    const { id, content, createAt, UserId } =
      await this.repositoryClubChats.save(clubChat);
    return {
      id,
      content,
      createAt,
      UserId,
    };
  }
}
