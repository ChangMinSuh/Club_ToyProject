import { IsString, IsNumber } from 'class-validator';

export class CreateMemberBody {
  @IsNumber()
  userId: number;

  @IsNumber()
  clubAppAnswerId: number;

  @IsString()
  nickname: string;
}
