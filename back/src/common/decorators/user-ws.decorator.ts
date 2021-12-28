import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Users } from 'src/models/users/entities/users.entity';

export const UserWs = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Users => {
    const request = ctx.switchToWs().getData();
    return request.user;
  },
);
