import { ApiProperty } from '@nestjs/swagger';
import { BloodType } from '@prisma/client';

export class ProfileEntity {
  @ApiProperty({ example: 'uuid-do-perfil' })
  id!: string;

  @ApiProperty({ example: 'Remédio A, Remédio B', nullable: true })
  medications!: string | null;

  @ApiProperty({ enum: BloodType, example: 'O+' })
  bloodType!: BloodType | null;
}
