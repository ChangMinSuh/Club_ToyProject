import { IsNumber } from 'class-validator';

export class CreateMemberBody {
  @IsNumber()
  userId: number;

  @IsNumber()
  clubAppAnswerId: number;
}
