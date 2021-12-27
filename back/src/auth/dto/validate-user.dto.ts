import { OmitType } from '@nestjs/swagger';
import { Users } from 'src/models/users/entities/users.entity';

export class ValidateUserReturn extends OmitType(Users, ['password']) {}
