import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ActiveUser } from '../auth/auth.interfaces';

describe('ProfileController', () => {
  let controller: ProfileController;
  let service: ProfileService;

  const mockProfileService = {
    findOne: jest.fn(),
    update: jest.fn(),
  };

  const mockActiveUser: ActiveUser = {
    id: 'user-uuid-123',
    name: 'Thaissa',
    email: 't@test.com',
    photoUrl: null,
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

      const result = await controller.findOne(mockActiveUser);

      expect(service.findOne).toHaveBeenCalledWith(mockActiveUser.id);
      expect(result).toEqual(mockProfile);
    });
  });

  describe('findMe', () => {
    it('deve retornar os dados do usuário combinados com o perfil plano', async () => {
      const mockProfileWithUser = {
        id: 'profile-uuid',
        userId: 'user-uuid-123',
        medications: 'Quetiapina',
        allergies: 'Nenhuma',
        bloodType: 'O_POSITIVE',
        updatedAt: new Date(),
        user: mockActiveUser,
      };

      mockProfileService.findOne.mockResolvedValue(mockProfileWithUser);
      const result = await controller.findMe(mockActiveUser);

      expect(service.findOne).toHaveBeenCalledWith(mockActiveUser.id);
      expect(result).toEqual({
        id: mockActiveUser.id,
        name: mockActiveUser.name,
        email: mockActiveUser.email,
        photoUrl: mockActiveUser.photoUrl,
        profile: {
          id: 'profile-uuid',
          medications: 'Quetiapina',
          allergies: 'Nenhuma',
          bloodType: 'O_POSITIVE',
        },
      });

      expect(result.profile).not.toHaveProperty('userId');
      expect(result.profile).not.toHaveProperty('updatedAt');
    });
  });
  describe('update', () => {
    it('deve chamar o service.update com o ID correto e os dados do DTO', async () => {
      const updateDto: UpdateProfileDto = {
        medications: 'Quetiapina',
        allergies: 'Nenhum',
      };

      const mockUpdatedProfile = { userId: mockActiveUser.id, ...updateDto };
      mockProfileService.update.mockResolvedValue(mockUpdatedProfile);

      const result = await controller.update(mockActiveUser, updateDto);

      expect(service.update).toHaveBeenCalledWith(mockActiveUser.id, updateDto);
      expect(result).toEqual(mockUpdatedProfile);
    });
  });
});
