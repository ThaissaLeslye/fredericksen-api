import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePerfilDto } from './dto/update-perfil.dto';

@Injectable()
export class PerfilService {
  constructor(private readonly prisma: PrismaService) {}

  findOne(userId: string) {
    return this.prisma.profile.findUnique({
      where: { userId },
      include: {
        user: true,
      },
    });
  }

  update(userId: string, updatePerfilDto: UpdatePerfilDto) {
    return this.prisma.profile.update({
      where: { userId },
      data: updatePerfilDto,
    });
  }
}
