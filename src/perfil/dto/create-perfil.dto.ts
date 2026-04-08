export enum TipoSanguineo {
  APositivo = 'A+',
  ANegativo = 'A-',
  BPositivo = 'B+',
  BNegativo = 'B-',
  ABPositivo = 'AB+',
  ABNegativo = 'AB-',
  OPositivo = 'O+',
  ONegativo = 'O-',
}

import { ApiProperty } from '@nestjs/swagger';

export class CreatePerfilDto {
  @ApiProperty({
    description: 'Lista de medicamentos em uso',
    example: 'Quetiapina, Citalopram, Lítio',
    required: false,
  })
  medicamentos?: string;

  @ApiProperty({
    description: 'Alergias conhecidas',
    example: 'Lactose, Dipirona',
    required: false,
  })
  alergias?: string;

  @ApiProperty({
    description: 'Tipo sanguineo',
    enum: TipoSanguineo,
    example: TipoSanguineo.OPositivo,
    required: false,
  })
  tipo_sanguineo!: TipoSanguineo;
}
