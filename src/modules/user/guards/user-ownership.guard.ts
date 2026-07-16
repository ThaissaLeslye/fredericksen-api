import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { ActiveUser } from '../../auth/auth.interfaces';

@Injectable()
export class UserOwnershipGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      params: { id?: string };
      user?: ActiveUser;
    }>();

    const userId = request.user?.id;
    const paramId = request.params?.id;

    if (!userId) {
      return false;
    }

    if (paramId && userId !== paramId) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar ou alterar recursos de outros usuários.',
      );
    }

    return true;
  }
}
