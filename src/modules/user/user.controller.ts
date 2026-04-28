import {
  Controller,
  Get,
  Post,
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
  ApiCreatedResponse,
  ApiBearerAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { ActiveUser } from '../auth/auth.interfaces';

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Cria um novo utilizador' })
  @ApiCreatedResponse({ type: UserEntity })
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = await this.userService.create(createUserDto);
    return new UserEntity(user);
  }

  @ApiOperation({
    summary: 'Lista todos os utilizadores (Apenas Admin/Interno)',
  })
  @ApiOkResponse({ type: [UserEntity] })
  @Get()
  async findAll(): Promise<UserEntity[]> {
    const users = await this.userService.findAll();
    return users.map((user) => new UserEntity(user));
  }

  @ApiOperation({ summary: 'Retorna o perfil do utilizador autenticado' })
  @ApiOkResponse({
    description: 'Dados do utilizador atual extraídos do banco de dados.',
    type: UserEntity,
  })
  @Get('me')
  async getMe(@CurrentUser() activeUser: ActiveUser): Promise<UserEntity> {
    const user = await this.userService.findOne(activeUser.id);
    if (!user) {
      throw new NotFoundException('Utilizador não encontrado.');
    }

    return new UserEntity(user);
  }

  @ApiOperation({ summary: 'Procura um utilizador específico pelo ID' })
  @ApiOkResponse({ type: UserEntity })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserEntity> {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException('Utilizador não encontrado.');
    }

    return new UserEntity(user);
  }

  @ApiOperation({ summary: 'Atualiza dados de um utilizador' })
  @ApiOkResponse({ type: UserEntity })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const updatedUser = await this.userService.update(id, updateUserDto);
    return new UserEntity(updatedUser);
  }

  @ApiOperation({ summary: 'Remove um utilizador do sistema' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
