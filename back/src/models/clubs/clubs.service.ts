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
import { GetClubAppQuestionsDto } from './dto/get-club-app-questions.dto';
import { FindOneClubDto } from './dto/find-one-club.dto';
import { getClubChatDto } from './dto/get-club-chat.dto';
import { GetClubDto } from './dto/get-club.dto';
import { SetClubBodyDto } from './dto/set-club-body.dto';
import { SetClubAppQuestionBodyDto } from './dto/set-club-app-question-body.dto';
import {
  ClubMembers,
  ClubMembersRoleEnum,
} from 'src/models/club-members/entities/club-members.entity';
import { ClubChats } from '../club-chats/entities/club-chats';
import { ClubAppQuestions } from '../club-app-questions/entities/club-app-questions.entity';
import { ClubAppAnswers } from '../club-app-answers/entities/club-app-answers.entity';
import { Users } from '../users/entities/users.entity';

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
    @InjectRepository(ClubIntroduces)
    private readonly clubIntroducesRepository: Repository<ClubChats>,
    @InjectRepository(ClubAppQuestions)
    private readonly clubAppQuestionsRepository: Repository<ClubAppQuestions>,
    @InjectRepository(ClubAppAnswers)
    private readonly clubAppAnswersRepository: Repository<ClubAppAnswers>,
  ) {}

  async findAllClubs(): Promise<GetClubDto[]> {
    return await this.clubsRepository
      .createQueryBuilder('clubs')
      .leftJoinAndSelect('clubs.Owner', 'owner')
      .getMany();
  }

  async findMyClubs({ userId }): Promise<GetClubDto[]> {
    const result = await this.clubsRepository
      .createQueryBuilder('clubs')
      .leftJoin('clubs.ClubMembers', 'clubMembers')
      .where('clubMembers.UserId = :userId', { userId })
      .leftJoinAndSelect('clubs.Owner', 'owner')
      .getMany();
    console.log(result);
    return result;
  }

  async findMyAppAnswers(userId: number) {
    const result = await this.clubsRepository
      .createQueryBuilder('clubs')
      .innerJoinAndSelect(
        'clubs.ClubAppAnswers',
        'clubAppAnswers',
        'clubAppAnswers.UserId = :userId AND clubAppAnswers.isFailed = :isFailed',
        { userId, isFailed: false },
      )
      .getMany();
    console.log(result);
    return result;
  }

  async setClub(
    userId: number,
    { name, explanation }: SetClubBodyDto,
  ): Promise<string> {
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

    return 'success';
  }

  async findOneClub({ clubId, userId }: FindOneClubDto): Promise<GetClubDto> {
    const oneClub = await this.clubsRepository
      .createQueryBuilder('clubs')
      .innerJoin('clubs.ClubMembers', 'clubMembers')
      .where('clubMembers.UserId = :userId', { userId })
      .andWhere('clubs.id = :clubId', { clubId })
      .getOne();
    if (!oneClub)
      throw new UnauthorizedException('동아리에 가입되지 않았습니다.');

    return oneClub;
  }

  async getClubChat({
    clubId,
  }: getClubChatDto): Promise<GetClubChatsDataDto[]> {
    const club = await this.clubsRepository.findOne({ id: clubId });
    if (!club) {
      throw new UnauthorizedException('클럽이 존재하지 않습니다.');
    }

    return await this.clubChatsRepository
      .createQueryBuilder('clubChats')
      .leftJoin('clubChats.User', 'user')
      .select([
        'clubChats.id',
        'clubChats.content',
        'clubChats.createAt',
        'clubChats.UserId',
      ])
      .addSelect('user.nickname')
      .where('clubChats.clubId = :clubId', { clubId })
      .getMany();
  }

  async getAppQuestions({ clubId }): Promise<GetClubAppQuestionsDto[]> {
    const result = await this.clubAppQuestionsRepository.find({
      where: { ClubId: clubId },
    });
    return result;
  }

  async findAllNewAppQuestionAnswers(clubId: number) {
    const result = await this.usersRepository
      .createQueryBuilder('users')
      .innerJoinAndSelect(
        'users.ClubAppQuestionAnswers',
        'clubAppQuestionAnswers',
        'clubAppQuestionAnswers.ClubId = :clubId',
        { clubId },
      )
      .where('clubAppQuestionAnswers.isFailed = :isFailed', { isFailed: false })
      .leftJoin('users.ClubMembers', 'clubMembers')
      .andWhere('clubMembers.ClubId IS NULL')
      .getMany();
    return result;
  }
}
