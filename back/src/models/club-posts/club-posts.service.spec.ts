import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClubPostsService } from './club-posts.service';
import { ClubPosts } from './entities/club-posts.entity';

const mockRepository = () => ({
  findOne: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('ClubPostsService', () => {
  let service: ClubPostsService;
  let clubPostsRepository: MockRepository<ClubPosts>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClubPostsService,
        {
          provide: getRepositoryToken(ClubPosts),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<ClubPostsService>(ClubPostsService);
    clubPostsRepository = module.get(getRepositoryToken(ClubPosts));
  });

  const clubPostTmp = {
    title: '안녕하세요',
    content: '안녕',
    ClubMemberId: 1,
    ClubId: 2,
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPost', () => {
    const createPostArgs = {
      clubId: 2,
      clubMemberId: 1,
      body: {
        title: '안녕하세요',
        content: '안녕',
      },
    };

    it('should create post', async () => {
      await service.createPost(
        createPostArgs.clubId,
        createPostArgs.clubMemberId,
        createPostArgs.body,
      );

      expect(clubPostsRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAllPosts', () => {
    const findAllPostsArgs = {
      clubId: 2,
    };

    it('should find all posts', async () => {
      clubPostsRepository.find.mockResolvedValue([clubPostTmp]);
      const result = await service.findAllPosts(findAllPostsArgs.clubId);

      expect(clubPostsRepository.find).toHaveBeenCalled();

      expect(result).toEqual([clubPostTmp]);
    });
  });

  describe('findPost', () => {
    const findPostArgs = {
      postId: 2,
    };

    it('should find post', async () => {
      clubPostsRepository.findOne.mockResolvedValue(clubPostTmp);
      const result = await service.findPost(findPostArgs.postId);

      expect(clubPostsRepository.findOne).toHaveBeenCalled();
      expect(clubPostsRepository.findOne).toHaveBeenCalledWith({
        where: { id: findPostArgs.postId },
        relations: ['ClubMember'],
      });

      expect(result).toEqual(clubPostTmp);
    });
  });

  describe('updatePost', () => {
    const updatePostArgs = {
      postId: 2,
      body: {
        title: '안녕하세요???',
        content: '하하하',
      },
    };

    it('should update post', async () => {
      clubPostsRepository.findOne.mockResolvedValue(updatePostArgs);
      await service.updatePost(updatePostArgs.postId, updatePostArgs.body);

      expect(clubPostsRepository.findOne).toHaveBeenCalled();
      expect(clubPostsRepository.findOne).toHaveBeenCalledWith({
        where: { id: updatePostArgs.postId },
      });

      expect(clubPostsRepository.save).toHaveBeenCalled();
    });
  });

  describe('removePost', () => {
    const removePostArgs = {
      postId: 2,
    };

    it('should remove post', async () => {
      clubPostsRepository.findOne.mockResolvedValue(clubPostTmp);
      await service.removePost(removePostArgs.postId);

      expect(clubPostsRepository.findOne).toHaveBeenCalled();
      expect(clubPostsRepository.findOne).toHaveBeenCalledWith({
        where: { id: removePostArgs.postId },
      });

      expect(clubPostsRepository.remove).toHaveBeenCalled();
      expect(clubPostsRepository.remove).toHaveBeenCalledWith(clubPostTmp);
    });
  });
});
