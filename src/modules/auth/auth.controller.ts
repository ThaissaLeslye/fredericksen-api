import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ThrottlerGuard } from '@nestjs/throttler';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiOkResponse } from '@nestjs/swagger';

import type { RequestWithUser } from './auth.interfaces';

@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation({
    summary: 'Inicia o processo de login via Google OAuth2',
  })
  @ApiOkResponse({
    description: 'Redirecionamento para autenticação Google iniciado.',
  })
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @ApiOperation({
    summary:
      'Processa o retorno do Google, valida o perfil do usuário e gera o token de acesso',
  })
  @ApiOkResponse({
    description:
      'Autenticação processada com sucesso, redirecionamento para aplicação.',
  })
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: RequestWithUser, @Res() res: Response) {
    const user = await this.authService.validateGoogleUser(req.user);

    const { access_token } = await this.authService.generateJwt(user);

    const isProduction =
      this.configService.get<string>('NODE_ENV')?.trim() === 'production';

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });

    const frontendUrl = this.configService.getOrThrow<string>(
      'FREDERICKSEN_WEB_URL',
    );
    const redirectUrl = frontendUrl.endsWith('/')
      ? `${frontendUrl}home`
      : `${frontendUrl}/home`;

    return res.redirect(redirectUrl);
  }
}
