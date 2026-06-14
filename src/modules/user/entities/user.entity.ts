import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UserEntity {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ example: 'uuid-do-usuario' })
  id!: string;

  @Exclude()
  googleId?: string;

  @ApiProperty({ example: 'Fulana de Tal' })
  name!: string;

  @ApiProperty({ example: 'fulana.tal@gmail.com' })
  email!: string;

  @ApiProperty({ example: 'https://foto.url', nullable: true })
  photoUrl!: string | null;

  @Exclude()
  lastLogin?: Date | null;

  @ApiProperty()
  createdAt!: Date;
}
