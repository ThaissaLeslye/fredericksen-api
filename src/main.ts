import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { ValidationPipe, Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

const frontend = process.env.FREDERICKSEN_WEB_URL;
const portNumber = process.env.PORT || 3000;

const bootstrapLogger = new Logger('Bootstrap');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  app.use(helmet());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  if (!frontend) {
    throw new Error(
      'Erro Crítico: A variável FREDERICKSEN_WEB_URL não foi informada.',
    );
  }

  const sanitizedOrigin: string = frontend.endsWith('/')
    ? frontend.slice(0, -1)
    : frontend;

  app.enableCors({
    origin: sanitizedOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type,Accept,Authorization',
  });

  const config = new DocumentBuilder()
    .setTitle('Fredericksen API')
    .setDescription('Documentação do Fredericksen')
    .setVersion('0.1.0')
    .addCookieAuth('access_token', {
      type: 'apiKey',
      in: 'cookie',
      name: 'access_token',
      description: 'JWT Token de acesso armazenado em cookie seguro HTTPOnly',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, document);

  await app.listen(portNumber, '0.0.0.0');

  bootstrapLogger.log(
    `Application is running on: https://rick-api.tllo.app/mvp1`,
  );
}
bootstrap().catch((err) => {
  console.error('Erro crítico durante a inicialização da aplicação:', err);
  process.exit(1);
});
