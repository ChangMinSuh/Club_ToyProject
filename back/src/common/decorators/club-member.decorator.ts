import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Users } from 'src/models/users/entities/users.entity';

export const ClubMember = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Users => {
    const request = ctx.switchToHttp().getRequest();
    return request.clubMember;
  },
);
