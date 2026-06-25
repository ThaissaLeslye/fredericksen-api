/**
 * @file profile.service.ts
 * @description Service layer for Profile resource management.
 * @responsibility Handles retrieval and mutation of user Profile records.
 * @strategy Delegates all persistence to PrismaService and maps domain errors to HTTP exceptions.
 * @logic Exposes findOne and update operations; guards against P2025 (record not found) and unknown failures.
 * @mapping Fulfills the ProfileModule use-cases consumed by ProfileController.
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(userId: string) {
    const profile = await this.prisma.client.profile.findUnique({
      where: { userId },
      include: {
        user: true,
      },
    });

    if (!profile) {
      throw new NotFoundException(
        `Perfil para o usuário com ID ${userId} não foi encontrado.`,
      );
    }

    return profile;
  }

  async update(userId: string, updateProfileDto: UpdateProfileDto) {
    await this.findOne(userId);

    return this.prisma.client.profile.update({
      where: { userId },
      data: updateProfileDto,
    });
  }
}
