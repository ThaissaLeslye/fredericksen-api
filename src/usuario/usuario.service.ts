import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(private readonly prisma: PrismaService) {}

  create(createUsuarioDto: CreateUsuarioDto) {
    return this.prisma.user.create({
      data: {
        ...createUsuarioDto,
        profile: {
          create: {},
        },
      },
      include: {
        profile: true,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUsuarioDto,
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
