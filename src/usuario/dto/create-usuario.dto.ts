import { ApiProperty } from '@nestjs/swagger';

export class CreateUsuarioDto {
  @ApiProperty({
    description: 'ID único fornecido pelo Google Auth',
    example: '1029384756',
  })
  google_id!: string;

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'Fulano de Tal',
  })
  nome!: string;

  @ApiProperty({
    description: 'E-mail principal da conta Google',
    example: 'email.email@email.com',
  })
  email!: string;

  @ApiProperty({
    description: 'URL da imagem de perfil do Google',
    example: 'https://lh3.googleusercontent.com/a/photo.jpg',
    required: false,
  })
  foto_url?: string;
}
