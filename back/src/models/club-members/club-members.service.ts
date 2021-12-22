import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClubMembers } from './entities/club-members.entity';

@Injectable()
export class ClubMembersService {
  constructor(
    @InjectRepository(ClubMembers)
    private readonly clubMembersRepository: Repository<ClubMembers>,
  ) {}

  async createMember(clubId: number, userId: number): Promise<string> {
    const clubMembers = new ClubMembers();
    clubMembers.UserId = userId;
    clubMembers.ClubId = clubId;
    await this.clubMembersRepository.save(clubMembers);
    return 'success';
  }

  async findAllMembers(clubId: number) {
    const clubMembersImpormations = await this.clubMembersRepository
      .createQueryBuilder('clubMembers')
      .select([
        'clubMembers.role',
        'clubMembers.grade',
        'clubMembers.createdAt',
        'clubMembers.updatedAt',
      ])
      .where('clubMembers.ClubId = :clubId', { clubId })
      .leftJoin('clubMembers.User', 'user')
      .addSelect(['user.id', 'user.email', 'user.nickname'])
      .leftJoinAndSelect(
        'user.ClubAppAnswers',
        'clubAppAnswers',
        'clubAppAnswers.isFailed = :isFailed AND clubAppAnswers.ClubId = :clubId',
        { isFailed: false, clubId },
      )
      .getMany();
    const result = clubMembersImpormations.map((clubMembersImpormation) => {
      const { User, ...etc } = clubMembersImpormation;
      return { ...etc, ...User };
    });
    console.log(result);
    return result;
  }
}
