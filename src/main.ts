import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

const frontend = process.env.FREDERICKSEN_WEB_URL;
const portNumber = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
  app.setGlobalPrefix('mvp1');
  app.enableCors({
    origin: frontend,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Fredericksen API')
    .setDescription('Documentação do Fredericksen')
    .setVersion('0.3.0')
    // .addTag('usuarios')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, document);

  await app.listen(portNumber, '0.0.0.0');

  console.log(`Application is running on: https://rick-api.tllo.app/mvp1`);
}
bootstrap().catch((err) => {
  console.error('Erro crítico durante a inicialização da aplicação:', err);
  process.exit(1);
});
