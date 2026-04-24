import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ActiveUser } from '../../modules/auth/auth.interfaces';
import { Request } from '@nestjs/common';

interface RequestWithUser extends Request {
  user: ActiveUser;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): ActiveUser => {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    // Aqui fazemos um "cast" seguro: dizemos que o user é do tipo ActiveUser
    return request.user;
  },
);
