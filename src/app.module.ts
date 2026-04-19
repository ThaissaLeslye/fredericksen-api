import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { PerfilModule } from './modules/perfil/perfil.module';
import { PrismaModule } from './modules/prisma/prisma.module';

@Module({
  imports: [UsuarioModule, PerfilModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
