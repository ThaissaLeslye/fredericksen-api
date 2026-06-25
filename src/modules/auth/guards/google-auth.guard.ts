import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  override getAuthenticateOptions(context: ExecutionContext) {
    const http = context.switchToHttp();
    const request = http.getRequest<{
      query: Record<string, string | undefined>;
    }>();

    const frontendUrl = this.configService.getOrThrow<string>(
      'FREDERICKSEN_WEB_URL',
    );
    const sanitizedUrl = frontendUrl.endsWith('/')
      ? frontendUrl.slice(0, -1)
      : frontendUrl;

    const errorType =
      request.query?.error === 'access_denied' ? 'cancel' : 'unauthorized';

    return {
      failureRedirect: `${sanitizedUrl}/login?error=${errorType}`,
    };
  }
}
