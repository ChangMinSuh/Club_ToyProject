import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClubChats } from './entities/club-chats';

@Injectable()
export class ClubChatsService {
  constructor(
    @InjectRepository(ClubChats)
    private readonly clubChatsRepository: Repository<ClubChats>,
  ) {}

  async setClubChat(data) {
    const clubChat = new ClubChats();
    clubChat.content = data.content;
    clubChat.ClubId = data.ClubId;
    clubChat.ClubMember = data.ClubMember;
    const result = await this.clubChatsRepository.save(clubChat);
    return result;
  }
}
