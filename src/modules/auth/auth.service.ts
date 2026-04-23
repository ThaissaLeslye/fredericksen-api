import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleUser, JwtPayload } from './auth.interfaces';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateGoogleUser(googleUser: GoogleUser) {
    return this.prisma.user.upsert({
      where: { googleId: googleUser.googleId },
      update: {
        lastLogin: new Date(),
        name: `${googleUser.firstName} ${googleUser.lastName}`,
        photoUrl: googleUser.picture,
      },
      create: {
        googleId: googleUser.googleId,
        email: googleUser.email,
        name: `${googleUser.firstName} ${googleUser.lastName}`,
        photoUrl: googleUser.picture,
        lastLogin: new Date(),
        profile: {
          create: {},
        },
      },
      include: {
        profile: true,
      },
    });
  }

  async generateJwt(user: User) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
