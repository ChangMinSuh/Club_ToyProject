import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entities/users.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserBody } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async createUser({
    email,
    password,
    nickname,
  }: CreateUserBody): Promise<void> {
    const chkUser = await this.usersRepository.findOne({ email });
    if (chkUser) throw new ConflictException('This email exists.');

    const hashPassword = await bcrypt.hash(password, 12);

    const newUser = new Users();
    newUser.email = email;
    newUser.password = hashPassword;
    newUser.nickname = nickname;
    await this.usersRepository.save(newUser);
    return;
  }
}
