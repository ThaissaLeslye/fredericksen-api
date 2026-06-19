import { Controller, Get, Body, Patch, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiOkResponse,
  ApiOperation,
  ApiCookieAuth,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ProfileEntity } from './entities/profile.entity';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { ActiveUser } from '../auth/auth.interfaces';

@Controller('profile')
@UseGuards(JwtAuthGuard)
@ApiCookieAuth()
@ApiUnauthorizedResponse({
  description:
    'Acesso negado: Cookie access_token ausente, expirado ou inválido.',
})
@ApiNotFoundResponse({
  description:
    'Recurso não encontrado: O perfil solicitado não existe para o usuário informado.',
})
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiOperation({ summary: 'Obtém o perfil do usuário logado' })
  @ApiOkResponse({
    description: 'Retorna os dados do usuário logado.',
    type: ProfileEntity,
  })
  @Get()
  findOne(@CurrentUser() user: ActiveUser) {
    return this.profileService.findOne(user.id);
  }

  @ApiOperation({ summary: 'Obtém o perfil do usuário logado (alias /me)' })
  @ApiOkResponse({
    description: 'Retorna os dados do usuário logado, com o perfil aninhado.',
  })
  @Get('me')
  async findMe(@CurrentUser() user: ActiveUser) {
    const { user: dbUser, ...profile } = await this.profileService.findOne(
      user.id,
    );

    return {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      photoUrl: dbUser.photoUrl,
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
    @CurrentUser() user: ActiveUser,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profileService.update(user.id, updateProfileDto);
  }
}
