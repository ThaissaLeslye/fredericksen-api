import { Controller, Get, Body, Patch, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import type { RequestWithUser } from './profile.interfaces';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiOkResponse, ApiOperation, ApiCookieAuth } from '@nestjs/swagger';
import { ProfileEntity } from './entities/profile.entity';

@Controller('profile')
@UseGuards(JwtAuthGuard)
@ApiCookieAuth()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiOperation({ summary: 'Obtém o perfil do usuário logado' })
  @ApiOkResponse({
    description: 'Retorna os dados do usuário logado.',
    type: ProfileEntity,
  })
  @Get()
  findOne(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.profileService.findOne(userId);
  }

  @ApiOperation({ summary: 'Obtém o perfil do usuário logado (alias /me)' })
  @ApiOkResponse({
    description: 'Retorna os dados do usuário logado, com o perfil aninhado.',
  })
  @Get('me')
  async findMe(@Req() req: RequestWithUser) {
    const { user, ...profile } = await this.profileService.findOne(req.user.id);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      photoUrl: user.photoUrl,
      profile,
    };
  }

  @ApiOperation({ summary: 'Atualiza o perfil do usuário logado' })
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
    return this.profileService.update(userId, updateProfileDto);
  }
}
