import { PickType } from '@nestjs/swagger';
import { Users } from '../entities/users.entity';

export class CreateUserBody extends PickType(Users, [
  'email',
  'password',
  'nickname',
] as const) {}
