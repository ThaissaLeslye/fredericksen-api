import { Controller, Get, Body, Patch, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import type { RequestWithUser } from './profile.interfaces';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiOkResponse } from '@nestjs/swagger';
import { ProfileEntity } from './entities/profile.entity';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly prisma: ProfileService) {}

  @ApiOkResponse({
    description: 'Retorna os dados do usuário logado.',
    type: ProfileEntity,
  })
  @Get()
  findOne(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.prisma.findOne(userId);
  }

  @ApiOkResponse({
    description: 'Perfil atualizado com sucesso.',
    type: UpdateProfileDto,
  })
  @Patch()
  update(
    @Req() req: RequestWithUser,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const userId = req.user.id;
    return this.prisma.update(userId, updateProfileDto);
  }
}
