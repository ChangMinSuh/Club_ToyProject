import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import {
  ClubAppAnswers,
  ClubAppAnswerStatusEnum,
} from '../club-app-answers/entities/club-app-answers.entity';
import { ClubMembers } from './entities/club-members.entity';

@Injectable()
export class ClubMembersService {
  constructor(
    private readonly connection: Connection,
    @InjectRepository(ClubMembers)
    private readonly clubMembersRepository: Repository<ClubMembers>,
    @InjectRepository(ClubAppAnswers)
    private readonly clubAppAnswersRepository: Repository<ClubAppAnswers>,
  ) {}

  async createMemberAndUpdateAppAnswer(
    clubId: number,
    userId: number,
    clubAppAnswerId: number,
    nickname: string,
  ): Promise<void> {
    const isMember = await this.clubMembersRepository.findOne({
      where: { UserId: userId, ClubId: clubId },
    });
    if (isMember)
      throw new UnauthorizedException('이미 가입되어 있는 회원입니다.');

    const clubMembers = new ClubMembers();
    clubMembers.UserId = userId;
    clubMembers.ClubId = clubId;
    clubMembers.nickname = nickname;

    const clubAppAnswers = await this.clubAppAnswersRepository.findOne({
      where: { id: clubAppAnswerId },
    });
    if (!clubAppAnswers) throw new ConflictException('db에 존재하지 않습니다.');

    clubAppAnswers.status = ClubAppAnswerStatusEnum.Passed;

    await this.connection.transaction(async (manager) => {
      await Promise.all([
        manager.getRepository(ClubMembers).save(clubMembers),
        manager.getRepository(ClubAppAnswers).save(clubAppAnswers),
      ]);
    });
    return;
  }

  async findAllMembers(clubId: number): Promise<ClubMembers[]> {
    const result = await this.clubMembersRepository.find({
      where: { ClubId: clubId },
    });
    return result;
  }

  async findMember(clubMemberId: number): Promise<ClubMembers> {
    const result = await this.clubMembersRepository.findOne({
      where: { id: clubMemberId },
    });
    return result;
  }
}
