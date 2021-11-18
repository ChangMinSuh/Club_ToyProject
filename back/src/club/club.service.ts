import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClubChats } from 'src/entities/clubChats';
import { Clubs } from 'src/entities/clubs';
import { Users } from 'src/entities/users';
import { Repository } from 'typeorm';
import { SetClubDto } from './dto/set-club.dto';

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

  findAllClubs() {
    return this.clubsRepository.find();
  }

  async findMyClubs(userId: number) {
    return await this.clubsRepository
      .createQueryBuilder('clubs')
      .leftJoin('clubs.Users', 'users')
      .where('users.id = :userId', { userId })
      .leftJoinAndSelect('clubs.Owner', 'owner')
      .getMany();
  }

  async setClub({ name, explanation }: SetClubDto, userId: number) {
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

  async findOneClub(name: string) {
    return await this.clubsRepository.findOne({ name });
  }

  async getClubChat(clubName: string) {
    const club = await this.clubsRepository.findOne({ name: clubName });
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
