import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ClubIntroducesService } from './club-introduces.service';
import { UpdateClubIntroduceDto } from './dto/update-club-introduce.dto';

@Controller('clubs/:clubId/introduce')
export class ClubIntroducesController {
  constructor(private readonly clubIntroducesService: ClubIntroducesService) {}

  @Post()
  createIntroduce(@Param('clubId', ParseIntPipe) clubId: number, @Body() body) {
    return this.clubIntroducesService.createIntroduce(clubId, body);
  }

  @ApiOperation({ summary: '클럽 소개내용 가져오기' })
  @Get()
  findIntroduce(@Param('clubId', ParseIntPipe) clubId: number) {
    return this.clubIntroducesService.findIntroduce(clubId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateClubIntroduceDto: UpdateClubIntroduceDto,
  ) {
    return this.clubIntroducesService.update(+id, updateClubIntroduceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clubIntroducesService.remove(+id);
  }
}
