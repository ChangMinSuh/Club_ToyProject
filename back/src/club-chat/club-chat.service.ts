import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClubChats } from 'src/entities/clubChats';
import { Repository } from 'typeorm';

@Injectable()
export class ClubChatService {
  constructor(
    @InjectRepository(ClubChats)
    private readonly clubChatsRepository: Repository<ClubChats>,
  ) {}

  async setClubChat(data) {
    const clubChat = new ClubChats();
    clubChat.content = data.content;
    clubChat.UserId = data.UserId;
    clubChat.ClubId = data.ClubId;
    const { id, content, createAt, UserId } =
      await this.clubChatsRepository.save(clubChat);
    return {
      id,
      content,
      createAt,
      UserId,
    };
  }
}
