import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CreateAppAnswerBody } from './dto/create-app-answer.dto';
import { UpdateAppAnswerStatusBody } from './dto/update-app-answer-status.dto';
import { ClubAppAnswerItems } from './entities/club-app-answers-item.entity';
import {
  ClubAppAnswers,
  ClubAppAnswerStatusEnum,
} from './entities/club-app-answers.entity';

@Injectable()
export class ClubAppAnswersService {
  constructor(
    private readonly connection: Connection,
    @InjectRepository(ClubAppAnswers)
    private readonly clubAppAnswersRepository: Repository<ClubAppAnswers>,
  ) {}

  async createAppAnswer(
    clubId: number,
    userId: number,
    body: CreateAppAnswerBody,
  ): Promise<void> {
    const clubAppAnswer = new ClubAppAnswers();
    clubAppAnswer.ClubId = clubId;
    clubAppAnswer.UserId = userId;
    clubAppAnswer.nickname = body.nickname;

    const clubAppAnswerItems = body.clubAppAnswerItems.map(
      (clubAppAnswerItem) => ({
        ClubAppAnswer: clubAppAnswer,
        ...clubAppAnswerItem,
      }),
    );

    await this.connection.transaction(async (manager) => {
      await manager.getRepository(ClubAppAnswers).save(clubAppAnswer);
      await manager.getRepository(ClubAppAnswerItems).save(clubAppAnswerItems);
    });
    return;
  }

  async findAllAppAnswers(
    clubId: number,
    status: ClubAppAnswerStatusEnum,
  ): Promise<ClubAppAnswers[]> {
    const result = status
      ? await this.clubAppAnswersRepository.find({
          where: { status, ClubId: clubId },
          relations: ['ClubAppAnswerItems', 'User'],
        })
      : await this.clubAppAnswersRepository.find({
          where: { ClubId: clubId },
          relations: ['ClubAppAnswerItems', 'User'],
        });
    return result;
  }

  async updateAppAnswerStatus(
    clubAppAnswerId: number,
    body: UpdateAppAnswerStatusBody,
  ): Promise<void> {
    const clubAppAnswer = await this.clubAppAnswersRepository.findOne(
      clubAppAnswerId,
    );
    clubAppAnswer.status = body.status;

    await this.clubAppAnswersRepository.save(clubAppAnswer);
    return;
  }
}
