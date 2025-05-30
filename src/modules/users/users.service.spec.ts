import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const hashedPassword = 'hashedPassword';

      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue({ email, password: hashedPassword });
      mockRepository.save.mockResolvedValue({ id: 1, email, password: hashedPassword });

      const result = await service.create(email, password);

      expect(result).toEqual({ id: 1, email, password: hashedPassword });
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    });

    it('should throw ConflictException if email already exists', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      mockRepository.findOne.mockResolvedValue({ id: 1, email });

      await expect(service.create(email, password)).rejects.toThrow(ConflictException);
    });
  });

  describe('findByEmail', () => {
    it('should return user by email', async () => {
      const email = 'test@example.com';
      const user = { id: 1, email };

      mockRepository.findOne.mockResolvedValue(user);

      const result = await service.findByEmail(email);

      expect(result).toEqual(user);
    });

    it('should return null if user not found', async () => {
      const email = 'test@example.com';

      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail(email);

      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return user by id', async () => {
      const id = 1;
      const user = { id, email: 'test@example.com' };

      mockRepository.findOne.mockResolvedValue(user);

      const result = await service.findById(id);

      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      const id = 1;

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findById(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update user', async () => {
      const id = 1;
      const updateData = { email: 'new@example.com' };
      const user = { id, email: 'test@example.com' };

      mockRepository.findOne.mockResolvedValue(user);
      mockRepository.save.mockResolvedValue({ ...user, ...updateData });

      const result = await service.update(id, updateData);

      expect(result).toEqual({ ...user, ...updateData });
    });

    it('should hash password if provided in update data', async () => {
      const id = 1;
      const updateData = { password: 'newpassword' };
      const user = { id, email: 'test@example.com' };
      const hashedPassword = 'hashedPassword';

      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);
      mockRepository.findOne.mockResolvedValue(user);
      mockRepository.save.mockResolvedValue({ ...user, password: hashedPassword });

      const result = await service.update(id, updateData);

      expect(result).toEqual({ ...user, password: hashedPassword });
      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 10);
    });

    it('should throw NotFoundException if user not found', async () => {
      const id = 1;
      const updateData = { email: 'new@example.com' };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(id, updateData)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove user', async () => {
      const id = 1;
      const user = { id, email: 'test@example.com' };

      mockRepository.findOne.mockResolvedValue(user);
      mockRepository.remove.mockResolvedValue(user);

      await service.remove(id);

      expect(mockRepository.remove).toHaveBeenCalledWith(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      const id = 1;

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(id)).rejects.toThrow(NotFoundException);
    });
  });
}); 