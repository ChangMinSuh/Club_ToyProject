import { Users } from 'src/entities/users';
import { PickType } from '@nestjs/mapped-types';

export class SignUpUserDto extends PickType(Users, [
  'email',
  'nickname',
  'password',
] as const) {}
