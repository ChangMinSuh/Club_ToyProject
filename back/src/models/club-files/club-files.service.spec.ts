import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { stringify } from 'querystring';
import { Repository } from 'typeorm';
import { ClubFilesService } from './club-files.service';
import { ClubFiles } from './entities/club-files.entity';

const mockRepository = () => ({
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('ClubFilesService', () => {
  let service: ClubFilesService;
  let clubFilesRepository: MockRepository<ClubFiles>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClubFilesService,
        {
          provide: getRepositoryToken(ClubFiles),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<ClubFilesService>(ClubFilesService);
    clubFilesRepository = module.get(getRepositoryToken(ClubFiles));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadFiles', () => {
    const uploadFilesArgs = {
      clubId: 1,
      clubMemberId: 1,
      files: [] as Express.MulterS3.File[],
    };
    it('should be return', async () => {
      await service.uploadFiles(
        uploadFilesArgs.clubId,
        uploadFilesArgs.clubMemberId,
        uploadFilesArgs.files,
      );
      expect(clubFilesRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('findClubMemberImages', () => {
    const findClubMemberImagesArgs = {
      clubMemberId: 1,
    };
    it('should be return', async () => {
      service.findClubMemberImages(findClubMemberImagesArgs.clubMemberId);
      expect(clubFilesRepository.find).toHaveBeenCalledTimes(1);
    });
  });
  describe('updateFile', () => {
    const updateFileArgs = {
      fileId: 1,
      body: {
        isShow: true,
      },
    };
    it('cannot find clubFiles', async () => {
      clubFilesRepository.findOne.mockResolvedValue(undefined);

      try {
        await service.updateFile(updateFileArgs.fileId, updateFileArgs.body);
        expect(clubFilesRepository.save).toHaveBeenCalledTimes(0);
      } catch (error) {
        expect(clubFilesRepository.findOne).toHaveBeenCalledTimes(1);

        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toEqual('db에 존재하지 않습니다.');
      }
    });
    it('should be return', async () => {
      const clubFileTemp = {
        filename: 'title',
        url: 'hello',
        isShow: false,
      };
      clubFilesRepository.findOne.mockResolvedValue(clubFileTemp);

      await service.updateFile(updateFileArgs.fileId, updateFileArgs.body);

      expect(clubFilesRepository.findOne).toHaveBeenCalledTimes(1);

      expect(clubFilesRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteFile', () => {
    const deleteFileArgs = {
      fileId: 1,
    };
    it('cannot find clubFiles', async () => {
      clubFilesRepository.findOne.mockResolvedValue(undefined);

      try {
        await service.deleteFile(deleteFileArgs.fileId);
        expect(clubFilesRepository.remove).toHaveBeenCalledTimes(0);
      } catch (error) {
        expect(clubFilesRepository.findOne).toHaveBeenCalledTimes(1);

        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toEqual('db에 존재하지 않습니다.');
      }
    });
    it('should be return', async () => {
      const clubFileTemp = {
        filename: 'title',
        url: 'hello',
        isShow: false,
      };
      clubFilesRepository.findOne.mockResolvedValue(clubFileTemp);

      await service.deleteFile(deleteFileArgs.fileId);

      expect(clubFilesRepository.findOne).toHaveBeenCalledTimes(1);

      expect(clubFilesRepository.remove).toHaveBeenCalledTimes(1);
    });
  });
});
