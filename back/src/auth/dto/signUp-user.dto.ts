import { Users } from 'src/models/users/entities/users.entity';
import { PickType } from '@nestjs/mapped-types';

export class SignUpUserDto extends PickType(Users, [
  'email',
  'nickname',
  'password',
] as const) {}
