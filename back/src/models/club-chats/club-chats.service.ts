import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../users/entities/users.entity';
import { ClubChats } from './entities/club-chats';

@Injectable()
export class ClubChatsService {
  constructor(
    @InjectRepository(ClubChats)
    private readonly clubChatsRepository: Repository<ClubChats>,
  ) {}

  async setClubChat(user: Users, data) {
    const clubChat = new ClubChats();
    clubChat.content = data.content;
    clubChat.UserId = data.user.id;
    clubChat.ClubId = data.ClubId;
    clubChat.User = user;
    const result = await this.clubChatsRepository.save(clubChat);
    return result;
  }
}
