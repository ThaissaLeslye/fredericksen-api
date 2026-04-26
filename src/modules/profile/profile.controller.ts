import { Controller, Get, Body, Patch, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import type { RequestWithUser } from './profile.interfaces';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('profile')
@UseGuards(JwtAuthGuard) // Garante que RNF01 (Segurança) seja cumprido
export class ProfileController {
  constructor(private readonly prisma: ProfileService) {}

  @Get()
  findOne(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.prisma.findOne(userId);
  }

  @Patch()
  update(
    @Req() req: RequestWithUser,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const userId = req.user.id;
    return this.prisma.update(userId, updateProfileDto);
  }
}
