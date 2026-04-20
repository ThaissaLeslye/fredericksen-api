import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleUser } from './auth.interfaces';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

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
}
