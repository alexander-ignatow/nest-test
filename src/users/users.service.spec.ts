import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user by email', async () => {
      const user: User = {
        id: 1,
        email: 'test@example.com',
        password: 'hashed',
        createdAt: new Date(),
      };
      repository.findOne.mockResolvedValue(user);

      const result = await service.findOne('test@example.com');
      expect(result).toEqual(user);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should return null if user not found', async () => {
      repository.findOne.mockResolvedValue(null);

      const result = await service.findOne('nonexistent@example.com');
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and save a new user', async () => {
      const user: User = {
        id: 1,
        email: 'test@example.com',
        password: 'hashed',
        createdAt: new Date(),
      };
      repository.create.mockReturnValue(user);
      repository.save.mockResolvedValue(user);

      const result = await service.create('test@example.com', 'hashed');
      expect(result).toEqual(user);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'hashed',
      });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.save).toHaveBeenCalledWith(user);
    });
  });
});
