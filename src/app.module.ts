import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
//import { DatabaseModule } from './database/database.module';
import { UsuarioModule } from './usuario/usuario.module';
import { PerfilModule } from './perfil/perfil.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [UsuarioModule, PerfilModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
