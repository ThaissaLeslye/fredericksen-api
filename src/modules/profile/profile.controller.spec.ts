import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

describe('ProfileController', () => {
  let controller: ProfileController;
  let service: ProfileService;

  const mockProfileService = {
    findOne: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        {
          provide: ProfileService,
          useValue: mockProfileService,
        },
      ],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
    service = module.get<ProfileService>(ProfileService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('deve chamar o service.findOne com o ID do usuário vindo do request', async () => {
      const mockUser = { id: 'user-uuid-123' };
      const mockProfile = { medications: 'Lítio', allergies: 'N/A' };

      mockProfileService.findOne.mockResolvedValue(mockProfile);

      const mockReq = { user: mockUser };

      const result = await controller.findOne(mockReq as any);

      expect(service.findOne).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(mockProfile);
    });
  });

  describe('findMe', () => {
    it('deve retornar os dados do usuário combinados com o perfil plano', async () => {
      const mockUserObj = {
        id: 'user-uuid-123',
        name: 'Thaissa',
        email: 't@test.com',
        photoUrl: null,
      };
      const mockProfileWithUser = {
        id: 'profile-uuid',
        medications: 'Quetiapina',
        bloodType: 'O_POSITIVE',
        user: mockUserObj,
      };

      mockProfileService.findOne.mockResolvedValue(mockProfileWithUser);
      const mockReq = { user: { id: 'user-uuid-123' } };

      const result = await controller.findMe(mockReq as any);

      expect(service.findOne).toHaveBeenCalledWith('user-uuid-123');
      expect(result).toEqual({
        id: mockUserObj.id,
        name: mockUserObj.name,
        email: mockUserObj.email,
        photoUrl: mockUserObj.photoUrl,
        profile: {
          id: 'profile-uuid',
          medications: 'Quetiapina',
          bloodType: 'O_POSITIVE',
        },
      });
    });
  });
  describe('update', () => {
    it('deve chamar o service.update com o ID correto e os dados do DTO', async () => {
      const userId = 'user-uuid-123';
      const updateDto: UpdateProfileDto = {
        medications: 'Quetiapina',
        allergies: 'Nenhum',
      };

      const mockUpdatedProfile = { userId, ...updateDto };
      mockProfileService.update.mockResolvedValue(mockUpdatedProfile);

      const mockReq = { user: { id: userId } };

      const result = await controller.update(mockReq as any, updateDto);

      expect(service.update).toHaveBeenCalledWith(userId, updateDto);
      expect(result).toEqual(mockUpdatedProfile);
    });
  });
});
