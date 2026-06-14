import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'ID único fornecido pelo Google Auth',
    example: '1029384756',
  })
  @IsString()
  @IsNotEmpty()
  googleId!: string;

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'Fulano de Tal',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: 'E-mail principal da conta Google',
    example: 'email.email@email.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'URL da imagem de perfil do Google',
    example: 'https://lh3.googleusercontent.com/a/photo.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  photoUrl?: string;
}
