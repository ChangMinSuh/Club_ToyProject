import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from 'http-exception.filter';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as csurf from 'csurf';
import { NestExpressApplication } from '@nestjs/platform-express';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix('api');
  app.use(cookieParser(process.env.COOKIE_SECRET));
  if (process.env.NODE_ENV === 'production') {
    console.log('production start');
    app.enableCors({
      origin: [`http://${process.env.BACK_HOST}`],
      credentials: true,
    });
    app.use(helmet());
    //app.use(csurf({ cookie: true, sessionKey: process.env.COOKIE_SECRET }));
  } else {
    app.enableCors({
      origin: ['http://localhost:8080', 'ws://localhost:80/'],
      credentials: true,
    });
  }

  const swaggerConfig = new DocumentBuilder()
    .setTitle('SweetIPO API')
    .setDescription('SweetIPO 개발을 위한 API 문서입니다.')
    .setVersion('1.0')
    .addCookieAuth('connect.sid')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/api/swagger', app, document);

  const port = process.env.BACK_PORT || 8000;
  await app.listen(port);
  console.log(`listening on port ${port}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
