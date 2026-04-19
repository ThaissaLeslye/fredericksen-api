import { ApiProperty } from '@nestjs/swagger';
import { BloodType } from '@prisma/client';

export class CreatePerfilDto {
  @ApiProperty({
    description: 'Lista de medicamentos em uso',
    example: 'Quetiapina, Citalopram, Lítio',
    required: false,
  })
  medicaments?: string;

  @ApiProperty({
    description: 'Alergias conhecidas',
    example: 'Lactose, Dipirona',
    required: false,
  })
  allergies?: string;

  @ApiProperty({
    description: 'Tipo sanguineo',
    enum: BloodType,
    example: BloodType.O_POSITIVE,
    required: false,
  })
  bloodType!: BloodType;
}
