import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../users/entities/users.entity';
import { CreateClubAppAnswerBodyDto } from './dto/create-club-app-answer-body.dto';
import { ClubAppAnswers } from './entities/club-app-answers.entity';

@Injectable()
export class ClubAppAnswersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(ClubAppAnswers)
    private readonly clubAppAnswersRepository: Repository<ClubAppAnswers>,
  ) {}

  async create(
    clubId: number,
    userId: number,
    body: CreateClubAppAnswerBodyDto,
  ): Promise<string> {
    const saveData = body.clubAppAnswers.map(
      ({ question, answer, answer_type }) => ({
        ClubId: clubId,
        UserId: userId,
        question,
        answer,
        answer_type,
      }),
    );
    await this.clubAppAnswersRepository.save(saveData);
    return 'success';
  }

  // 고칠 필요가 있음. user 많아지면 감당 못할듯..
  async findAllAppAnswersNotMembers(clubId: number) {
    const result = await this.usersRepository
      .createQueryBuilder('users')
      .innerJoinAndSelect(
        'users.ClubAppAnswers',
        'clubAppAnswers',
        'clubAppAnswers.ClubId = :clubId And clubAppAnswers.isFailed = :isFailed',
        { clubId, isFailed: false },
      )
      .leftJoin('users.ClubMembers', 'clubMembers')
      .where('clubMembers.ClubId != :clubId', { clubId })
      .getMany();
    return result;
  }
}
