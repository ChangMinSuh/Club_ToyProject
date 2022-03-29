import {
  CACHE_MANAGER,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Clubs } from './entities/clubs.entity';
import { Connection, Repository } from 'typeorm';
import {
  ClubMembers,
  ClubMembersRoleEnum,
} from 'src/models/club-members/entities/club-members.entity';
import { ClubChats } from '../club-chats/entities/club-chats.entity';
import { Users } from '../users/entities/users.entity';
import { CreateClubBody } from './dtos/create-club.dto';
import {
  ClubAppAnswers,
  ClubAppAnswerStatusEnum,
} from '../club-app-answers/entities/club-app-answers.entity';
import { Cache } from 'cache-manager';

@Injectable()
export class ClubsService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly redisManager: Cache,
    @InjectRepository(Clubs)
    private readonly clubsRepository: Repository<Clubs>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(ClubChats)
    private readonly clubChatsRepository: Repository<ClubChats>,
    @InjectRepository(ClubAppAnswers)
    private readonly clubAppAnswersRepository: Repository<ClubAppAnswers>,
    private readonly connection: Connection,
  ) {}

  async createClub(
    userId: number,
    { name, explanation, nickname }: CreateClubBody,
  ): Promise<void> {
    const hasClub = await this.clubsRepository.findOne({ name });
    if (hasClub) {
      throw new ConflictException('동아리 이름이 중복됩니다.');
    }

    const user = await this.usersRepository.findOne({ id: userId });
    if (!user) {
      throw new ConflictException('존재하지 않는 사용자입니다.');
    }

    const club = new Clubs();
    club.name = name;
    club.explanation = explanation;
    club.Owner = user;

    const clubMembers = new ClubMembers();
    clubMembers.UserId = userId;
    clubMembers.role = ClubMembersRoleEnum.Manager;
    clubMembers.nickname = nickname;
    clubMembers.Club = club;

    await this.connection.transaction(async (manager) => {
      await manager.getRepository(Clubs).save(club);
      await manager.getRepository(ClubMembers).save(clubMembers);
    });
    // redis 업데이트
    const userInRedis = await this.redisManager.get<Users>(`user:${userId}`);
    userInRedis.ClubMembers.push(clubMembers);
    await this.redisManager.set(`user:${userId}`, userInRedis, {
      ttl: Number(process.env.JWT_REFRESH_EXPIRY_TIME),
    });
    return;
  }

  async findAllClubs(): Promise<Clubs[]> {
    const result = await this.clubsRepository.find({ relations: ['Owner'] });
    return result;
  }

  async findMyClubs(userId: number): Promise<Clubs[]> {
    const result = await this.clubsRepository
      .createQueryBuilder('clubs')
      .leftJoin('clubs.ClubMembers', 'clubMembers')
      .where('clubMembers.UserId = :userId', { userId })
      .leftJoinAndSelect('clubs.Owner', 'owner')
      .getMany();
    return result;
  }

  // 일부만 반환.
  async findMyWatingAppAnswers(userId: number): Promise<ClubAppAnswers[]> {
    const result = await this.clubAppAnswersRepository.find({
      where: { UserId: userId, status: ClubAppAnswerStatusEnum.Waiting },
    });
    return result;
  }

  async findOneClub(clubId: number): Promise<Clubs> {
    const result = this.clubsRepository.findOne({
      where: { id: clubId },
      relations: ['Owner'],
    });
    return result;
  }

  async getClubChat(clubId: number): Promise<ClubChats[]> {
    const club = await this.clubsRepository.findOne({ id: clubId });
    if (!club) {
      throw new ConflictException('클럽이 존재하지 않습니다.');
    }

    const result = await this.clubChatsRepository.find({
      where: { ClubId: clubId },
      relations: ['ClubMember'],
    });

    return result;
  }
}
