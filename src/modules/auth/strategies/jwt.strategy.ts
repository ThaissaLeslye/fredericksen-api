import { Request } from 'express';
import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { JwtPayload } from '../auth.interfaces';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    const secret = configService.getOrThrow<string>('JWT_SECRET');

    if (!secret) {
      throw new InternalServerErrorException(
        'JWT_SECRET não definida no ambiente',
      );
    }

    super({
      jwtFromRequest: (req: Request) => JwtStrategy.extractJwt(req),
      secretOrKey: secret,
      ignoreExpiration: false,
    });
  }

  private static extractJwt(this: void, req: Request): string | null {
    const cookies = req?.cookies as Record<string, unknown> | undefined;
    const token = cookies?.['access_token'];

    return typeof token === 'string' ? token : null;
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        name: true,
        email: true,
        photoUrl: true,
        profile: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException(
        'Acesso não autorizado: credenciais inválidas',
      );
    }

    return user;
  }
}
