import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetClubChatsDataDto } from 'src/models/club-chats/dto/get-clubchats-data.dto';
import { ClubIntroduces } from 'src/models/club-introduces/entities/club-introduces.entity';
import { Clubs } from './entities/clubs.entity';
import { Connection, Repository } from 'typeorm';
import {
  ClubMembers,
  ClubMembersRoleEnum,
} from 'src/models/club-members/entities/club-members.entity';
import { ClubChats } from '../club-chats/entities/club-chats';
import { ClubAppQuestions } from '../club-app-questions/entities/club-app-questions.entity';
import { Users } from '../users/entities/users.entity';
import { CreateClubBody } from './dtos/create-club.dto';
import {
  ClubAppAnswers,
  ClubAppAnswerStatusEnum,
} from '../club-app-answers/entities/club-app-answers.entity';

@Injectable()
export class ClubsService {
  constructor(
    private readonly connection: Connection,
    @InjectRepository(Clubs)
    private readonly clubsRepository: Repository<Clubs>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(ClubMembers)
    private readonly clubMembersRepository: Repository<ClubMembers>,
    @InjectRepository(ClubChats)
    private readonly clubChatsRepository: Repository<ClubChats>,
    @InjectRepository(ClubAppAnswers)
    private readonly clubAppAnswersRepository: Repository<ClubAppAnswers>,
  ) {}

  async createClub(
    userId: number,
    { name, explanation }: CreateClubBody,
  ): Promise<void> {
    const hasClub = await this.clubsRepository.findOne({ name });
    if (hasClub) {
      throw new ConflictException('동아리 이름이 중복됩니다.');
    }

    const user = await this.usersRepository.findOne({ id: userId });
    if (!user) {
      throw new UnauthorizedException('존재하지 않는 사용자입니다.');
    }

    const club = new Clubs();
    club.name = name;
    club.explanation = explanation;
    club.Owner = user;

    const clubMembers = new ClubMembers();
    clubMembers.UserId = userId;
    clubMembers.role = ClubMembersRoleEnum.Manager;
    clubMembers.Club = club;

    await this.connection.transaction(async (manager) => {
      await manager.getRepository(Clubs).save(club);
      await manager.getRepository(ClubMembers).save(clubMembers);
    });
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
    console.log(result);
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
      throw new UnauthorizedException('클럽이 존재하지 않습니다.');
    }

    const result = await this.clubChatsRepository.find({
      where: { ClubId: clubId },
      relations: ['User'],
    });

    return result;
  }
}
