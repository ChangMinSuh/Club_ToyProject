import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetClubChatsDataDto } from 'src/club-chat/dto/get-clubchats-data.dto';
import { ClubAppQuestions } from 'src/entities/clubAppQuestion';
import { ClubChats } from 'src/entities/clubChats';
import { ClubIntroduces } from 'src/entities/clubIntroduces';
import { Clubs } from 'src/entities/clubs';
import { Users } from 'src/entities/users';
import { Repository } from 'typeorm';
import { GetClubAppQuestionsDto } from './dto/get-club-app-questions.dto';
import { FindOneClubDto } from './dto/find-one-club.dto';
import { getClubChatDto } from './dto/get-club-chat.dto';
import { GetClubDto } from './dto/get-club.dto';
import { SetClubBodyDto } from './dto/set-club-body.dto';
import { SetClubAppQuestionBodyDto } from './dto/set-club-app-question-body.dto';
import { ClubAppQuestionAnswers } from 'src/entities/clubAppQuestionAnswers';
import { UserClubs } from 'src/entities/userClubs';

@Injectable()
export class ClubService {
  constructor(
    @InjectRepository(Clubs)
    private readonly clubsRepository: Repository<Clubs>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(UserClubs)
    private readonly userClubsRepository: Repository<UserClubs>,
    @InjectRepository(ClubChats)
    private readonly clubChatsRepository: Repository<ClubChats>,
    @InjectRepository(ClubIntroduces)
    private readonly clubIntroducesRepository: Repository<ClubChats>,
    @InjectRepository(ClubAppQuestions)
    private readonly clubAppQuestionsRepository: Repository<ClubAppQuestions>,
    @InjectRepository(ClubAppQuestionAnswers)
    private readonly clubAppQuestionAnswersRepository: Repository<ClubAppQuestionAnswers>,
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
      .leftJoin('clubs.Users', 'users')
      .where('users.id = :userId', { userId })
      .leftJoinAndSelect('clubs.Owner', 'owner')
      .getMany();
    console.log(result);
    return result;
  }

  async findMyAppQuestionAnswers({ userId }) {
    // const result = await this.clubAppQuestionAnswersRepository.find({
    //   UserId: userId,
    // });

    const result = await this.clubsRepository
      .createQueryBuilder('clubs')
      .innerJoinAndSelect(
        'clubs.ClubAppQuestionAnswers',
        'clubAppQuestionAnswers',
        'clubAppQuestionAnswers.UserId = :userId AND clubAppQuestionAnswers.isFailed = :isFailed',
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
    club.Users = [user];
    await this.clubsRepository.save(club);
    return 'success';
  }

  async findOneClub({ clubId, userId }: FindOneClubDto): Promise<GetClubDto> {
    const oneClub = await this.clubsRepository
      .createQueryBuilder('clubs')
      .innerJoin('clubs.Users', 'users')
      .where('users.id = :userId', { userId })
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

  async getClubIntroduce({ clubId }) {
    const result = await this.clubIntroducesRepository.findOne({
      where: { ClubId: clubId },
    });
    return result;
  }

  async findAllUsersImpormation(clubId: number) {
    /*const result = await this.usersRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect(
        'users.ClubAppQuestionAnswers',
        'clubAppQuestionAnswers',
        'clubAppQuestionAnswers.ClubId = :clubId',
        { clubId },
      )
      .innerJoin('users.UserClubs', 'userClubs', 'userClubs.ClubId = :clubId', {
        clubId,
      })
      .addSelect(['userClubs.role', 'userClubs.grade'])
      .getMany();
      */
    const usersImpormations = await this.userClubsRepository
      .createQueryBuilder('userClubs')
      .select([
        'userClubs.role',
        'userClubs.grade',
        'userClubs.createAt',
        'userClubs.updateAt',
      ])
      .where('userClubs.ClubId = :clubId', { clubId })
      .leftJoin('userClubs.User', 'user')
      .addSelect(['user.id', 'user.email', 'user.nickname'])
      .leftJoinAndSelect(
        'user.ClubAppQuestionAnswers',
        'clubAppQuestionAnswers',
      )
      .getMany();
    const result = usersImpormations.map((usersImpormation) => {
      const { User, ...etc } = usersImpormation;
      return { ...etc, ...User };
    });
    console.log(result);
    return result;
  }

  async addUserClubs({ clubId, userId }) {
    const userClubs = new UserClubs();
    userClubs.UserId = userId;
    userClubs.ClubId = clubId;
    await this.userClubsRepository.save(userClubs);
    return 'success';
  }

  async getAppQuestions({ clubId }): Promise<GetClubAppQuestionsDto[]> {
    const result = await this.clubAppQuestionsRepository.find({
      where: { ClubId: clubId },
    });
    return result;
  }

  async setAppQuestions(
    clubId: number,
    body: SetClubAppQuestionBodyDto,
  ): Promise<GetClubAppQuestionsDto> {
    const clubAppQuestions = new ClubAppQuestions();
    clubAppQuestions.question = body.question;
    clubAppQuestions.answer_type = body.answer_type;
    clubAppQuestions.ClubId = clubId;
    const result = await this.clubAppQuestionsRepository.save(clubAppQuestions);
    return result;
  }

  async updateAppQuestions(
    clubId: number,
    clubAppQuestionId: number,
    body,
  ): Promise<GetClubAppQuestionsDto> {
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

  async deleteAppQuestions(
    clubId: number,
    clubAppQuestionId: number,
  ): Promise<string> {
    const appQuestion = await this.clubAppQuestionsRepository.findOne({
      id: clubAppQuestionId,
      ClubId: clubId,
    });

    if (!appQuestion) {
      throw new ConflictException('질문이 존재하지 않습니다.');
    }

    await this.clubAppQuestionsRepository.remove(appQuestion);
    return 'success';
  }

  async setAppQuestionAnswers(clubId: number, userId: number, body) {
    const saveData = body.clubAppQuestionAnswers.map(
      ({ question, answer, answer_type }) => ({
        ClubId: clubId,
        UserId: userId,
        question,
        answer,
        answer_type,
      }),
    );
    await this.clubAppQuestionAnswersRepository.save(saveData);
    return 'success';
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
      .leftJoin('users.UserClubs', 'userClubs')
      .andWhere('userClubs.ClubId IS NULL')
      .getMany();
    return result;
  }
}
