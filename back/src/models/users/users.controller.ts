import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserBody } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '유저 추가(회원가입)' })
  @Post()
  createUser(@Body() body: CreateUserBody): Promise<void> {
    this.usersService.createUser(body);
    return;
  }
}
