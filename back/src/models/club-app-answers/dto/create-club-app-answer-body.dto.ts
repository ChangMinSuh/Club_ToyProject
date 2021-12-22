import { IsArray } from 'class-validator';

export class CreateClubAppAnswerBodyDto {
  @IsArray()
  clubAppAnswers: [];
}
