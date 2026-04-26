import { ApiProperty } from '@nestjs/swagger';
import { BloodType } from '@prisma/client';
import { IsString, IsOptional, MaxLength, IsEnum } from 'class-validator';

export class CreateProfileDto {
  @ApiProperty({
    description: 'Lista de medicamentos em uso',
    example: 'Quetiapina, Citalopram, Lítio',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  medications?: string;

  @ApiProperty({
    description: 'Alergias conhecidas',
    example: 'Lactose, Dipirona',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  allergies?: string;

  @ApiProperty({
    description: 'Tipo sanguineo',
    enum: BloodType,
    example: BloodType.O_POSITIVE,
    required: false,
  })
  @IsEnum(BloodType)
  @IsOptional()
  bloodType?: BloodType;
}
