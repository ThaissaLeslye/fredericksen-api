import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiCookieAuth,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { ActiveUser } from '../auth/auth.interfaces';

@ApiTags('User')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Retorna o perfil do usuário autenticado' })
  @ApiOkResponse({
    description: 'Dados do usuário atual extraídos do banco de dados.',
    type: UserEntity,
  })
  @ApiCookieAuth()
  @ApiUnauthorizedResponse({ description: 'Acesso negado: Sessão inválida.' })
  @ApiNotFoundResponse({
    description: 'Usuário logado não foi localizado no banco de dados.',
  })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@CurrentUser() activeUser: ActiveUser): Promise<UserEntity> {
    const user = await this.userService.findOne(activeUser.id);
    if (!user) {
      throw new NotFoundException('usuário não encontrado.');
    }

    return new UserEntity(user);
  }

  @ApiOperation({ summary: 'Procura um usuário específico pelo ID' })
  @ApiOkResponse({
    description: 'Usuário encontrado retornado com sucesso.',
    type: UserEntity,
  })
  @ApiCookieAuth()
  @ApiUnauthorizedResponse({
    description: 'Acesso negado: Requer autenticação.',
  })
  @ApiNotFoundResponse({
    description: 'O ID fornecido não corresponde a nenhum usuário cadastrado.',
  })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserEntity> {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException('usuário não encontrado.');
    }

    return new UserEntity(user);
  }

  @ApiOperation({ summary: 'Atualiza dados de um usuário' })
  @ApiOkResponse({
    description: 'Dados do usuário atualizados com sucesso.',
    type: UserEntity,
  })
  @ApiCookieAuth()
  @ApiUnauthorizedResponse({
    description: 'Acesso negado: Permissão insuficiente.',
  })
  @ApiNotFoundResponse({
    description: 'Impossível atualizar: Usuário inexistente.',
  })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const updatedUser = await this.userService.update(id, updateUserDto);
    return new UserEntity(updatedUser);
  }

  @ApiOperation({ summary: 'Remove um usuário do sistema' })
  @ApiOkResponse({ description: 'usuário removido com sucesso.' })
  @ApiCookieAuth()
  @ApiUnauthorizedResponse({ description: 'Acesso negado.' })
  @ApiNotFoundResponse({
    description: 'Impossível remover: Usuário não localizado.',
  })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
