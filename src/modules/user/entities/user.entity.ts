import { ApiProperty } from '@nestjs/swagger';

export class UserEntity {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ example: 'uuid-do-usuario' })
  id!: string;

  @ApiProperty({ example: 'Fulana de Tal' })
  name!: string;

  @ApiProperty({ example: 'fulana.tal@gmail.com' })
  email!: string;

  @ApiProperty({ example: 'https://foto.url', nullable: true })
  photoUrl!: string | null;

  @ApiProperty()
  createdAt!: Date;
}
