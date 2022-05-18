import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClubFiles } from './entities/club-files.entity';

@Injectable()
export class ClubFilesService {
  constructor(
    @InjectRepository(ClubFiles)
    private readonly clubFilesRepository: Repository<ClubFiles>,
  ) {}

  async uploadFiles(
    clubId: number,
    clubMemberId: number,
    files: Express.MulterS3.File[],
  ): Promise<ClubFiles[]> {
    const uploadFiles: ClubFiles[] = [];
    await files.forEach((file) => {
      const clubFile = new ClubFiles();
      clubFile.ClubId = clubId;
      clubFile.ClubMemberId = clubMemberId;
      clubFile.filename = file.originalname;
      clubFile.url = file.location;
      uploadFiles.push(clubFile);
    });
    return this.clubFilesRepository.save(uploadFiles);
  }

  async findClubMemberImages(clubMemberId: number): Promise<ClubFiles[]> {
    return this.clubFilesRepository.find({
      where: { ClubMemberId: clubMemberId },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async updateFile(
    fileId: number,
    body: { isShow: boolean },
  ): Promise<ClubFiles> {
    const beforeClubFile = await this.clubFilesRepository.findOne({
      where: { id: fileId },
    });
    if (!beforeClubFile) {
      throw new ConflictException('db에 존재하지 않습니다.');
    }
    beforeClubFile.isShow = body.isShow;
    const afterClubFile = await this.clubFilesRepository.save(beforeClubFile);
    return afterClubFile;
  }

  async deleteFile(fileId: number): Promise<void> {
    const clubFile = await this.clubFilesRepository.findOne({
      where: { id: fileId },
    });
    if (!clubFile) {
      throw new ConflictException('db에 존재하지 않습니다.');
    }
    await this.clubFilesRepository.remove(clubFile);
    return;
  }
}
