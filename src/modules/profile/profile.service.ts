import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  findOne(userId: string) {
    return this.prisma.profile.findUnique({
      where: { userId },
      include: {
        user: true,
      },
    });
  }

  async update(userId: string, updateProfileDto: UpdateProfileDto) {
    try {
      return await this.prisma.profile.update({
        where: { userId },
        data: {
          medications: updateProfileDto.medications,
          allergies: updateProfileDto.allergies,
          bloodType: updateProfileDto.bloodType,
        },
      });
    } catch (error) {
      // Verificamos se o erro é uma instância de erro conhecido do Prisma
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(
            `Perfil para o usuário com ID ${userId} não existe.`,
          );
        }
      }

      throw new InternalServerErrorException(
        'Erro inesperado ao atualizar o perfil.',
      );
    }
  }
}
