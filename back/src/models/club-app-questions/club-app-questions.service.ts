import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAppQuestionBody } from './dtos/create-app-question.dto';
import { UpdateAppQuestionBody } from './dtos/update-app-question.dto';
import { ClubAppQuestions } from './entities/club-app-questions.entity';

@Injectable()
export class ClubAppQuestionsService {
  constructor(
    @InjectRepository(ClubAppQuestions)
    private readonly clubAppQuestionsRepository: Repository<ClubAppQuestions>,
  ) {}

  async createAppQuestion(
    clubId: number,
    body: CreateAppQuestionBody,
  ): Promise<ClubAppQuestions> {
    const clubAppQuestions = new ClubAppQuestions();
    clubAppQuestions.question = body.question;
    clubAppQuestions.answer_type = body.answer_type;
    clubAppQuestions.ClubId = clubId;
    const result = await this.clubAppQuestionsRepository.save(clubAppQuestions);
    return result;
  }

  async findAppQuestions(clubId: number): Promise<ClubAppQuestions[]> {
    const result = await this.clubAppQuestionsRepository.find({
      where: { ClubId: clubId },
    });
    return result;
  }

  async updateAppQuestion(
    clubId: number,
    clubAppQuestionId: number,
    body: UpdateAppQuestionBody,
  ): Promise<ClubAppQuestions> {
    const appQuestion = await this.clubAppQuestionsRepository.findOne({
      id: clubAppQuestionId,
      ClubId: clubId,
    });

    if (!appQuestion) {
      throw new ConflictException('질문이 존재하지 않습니다.');
    }

    appQuestion.question = body.question;
    const result = await this.clubAppQuestionsRepository.save(appQuestion);
    return result;
  }

  async removeAppQuestion(
    clubId: number,
    clubAppQuestionId: number,
  ): Promise<void> {
    const appQuestion = await this.clubAppQuestionsRepository.findOne({
      id: clubAppQuestionId,
      ClubId: clubId,
    });

    if (!appQuestion) {
      throw new ConflictException('질문이 존재하지 않습니다.');
    }

    await this.clubAppQuestionsRepository.remove(appQuestion);
    return;
  }
}
