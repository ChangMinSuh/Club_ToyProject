import { OmitType, PickType } from '@nestjs/swagger';
import { Users } from 'src/models/users/entities/users.entity';

export class ValidateUserReturn extends OmitType(Users, ['password']) {}

export class ValidateUserBefore extends PickType(Users, ['id']) {}
