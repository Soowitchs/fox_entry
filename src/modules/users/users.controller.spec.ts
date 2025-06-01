import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    create: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const mockUser = {
        id: 1,
        ...createUserDto,
      };

      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await controller.create(createUserDto);

      expect(result).toEqual(mockUser);
      expect(mockUsersService.create).toHaveBeenCalledWith(
        createUserDto.email,
        createUserDto.password,
      );
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const id = '1';
      const mockUser = {
        id: 1,
        email: 'test@example.com',
      };

      mockUsersService.findById.mockResolvedValue(mockUser);

      const result = await controller.findOne(id);

      expect(result).toEqual(mockUser);
      expect(mockUsersService.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const id = '1';
      const updateUserDto: UpdateUserDto = {
        email: 'new@example.com',
      };
      const mockUser = {
        id: 1,
        email: 'new@example.com',
      };

      mockUsersService.update.mockResolvedValue(mockUser);

      const result = await controller.update(id, updateUserDto);

      expect(result).toEqual(mockUser);
      expect(mockUsersService.update).toHaveBeenCalledWith(1, updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const id = '1';

      mockUsersService.remove.mockResolvedValue(undefined);

      await controller.remove(id);

      expect(mockUsersService.remove).toHaveBeenCalledWith(1);
    });
  });
});
