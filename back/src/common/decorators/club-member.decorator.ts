import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ClubMembers } from 'src/models/club-members/entities/club-members.entity';

export const ClubMember = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): ClubMembers => {
    const { user, url } = ctx.switchToHttp().getRequest();
    const clubId = Number(url.split('/')[3]);

    if (isNaN(clubId)) throw new Error('이 데코레이터를 사용할 수 없습니다.');

    const clubMember = user?.ClubMembers?.find(
      (clubMember) => clubMember.ClubId === clubId,
    );
    return clubMember;
  },
);
