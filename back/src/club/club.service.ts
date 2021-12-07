import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetClubChatsDataDto } from 'src/club-chat/dto/get-clubchats-data.dto';
import { ClubChats } from 'src/entities/clubChats';
import { Clubs } from 'src/entities/clubs';
import { Users } from 'src/entities/users';
import { Repository } from 'typeorm';
import { FindOneClubDto } from './dto/find-one-club.dto';
import { getClubChatDto } from './dto/get-club-chat.dto';
import { GetClubDto } from './dto/get-club.dto';
import { SetClubBodyDto } from './dto/set-club-body.dto';

@Injectable()
export class ClubService {
  constructor(
    @InjectRepository(Clubs)
    private readonly clubsRepository: Repository<Clubs>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(ClubChats)
    private readonly clubChatsRepository: Repository<ClubChats>,
  ) {}

  async findAllClubs(): Promise<GetClubDto[]> {
    return await this.clubsRepository
      .createQueryBuilder('clubs')
      .leftJoinAndSelect('clubs.Owner', 'owner')
      .getMany();
  }

  async findMyClubs({ userId }): Promise<GetClubDto[]> {
    return await this.clubsRepository
      .createQueryBuilder('clubs')
      .leftJoin('clubs.Users', 'users')
      .where('users.id = :userId', { userId })
      .leftJoinAndSelect('clubs.Owner', 'owner')
      .getMany();
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

  async findOneClub({ name, userId }: FindOneClubDto): Promise<GetClubDto> {
    const isClubMember = await this.clubsRepository
      .createQueryBuilder('clubs')
      .innerJoin('clubs.Users', 'users')
      .where('users.id = :userId', { userId })
      .andWhere('clubs.name = :name', { name })
      .getOne();
    if (!isClubMember)
      throw new UnauthorizedException('동아리에 가입되지 않았습니다.');

    return isClubMember;
  }

  async getClubChat({ name }: getClubChatDto): Promise<GetClubChatsDataDto[]> {
    const club = await this.clubsRepository.findOne({ name });
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
      .where('clubChats.ClubId = :clubId', { clubId: club.id })
      .getMany();
  }
}
