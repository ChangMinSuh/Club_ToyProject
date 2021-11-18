import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from 'http-exception.filter';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (process.env.NODE_ENV === 'production') {
    app.enableCors({
      //origin: ['https://sleact.nodebird.com'],
      credentials: true,
    });
  } else {
    app.enableCors({
      origin: ['http://localhost:3000', 'ws://localhost:80/'],
      credentials: true,
    });
  }
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(cookieParser(process.env.COOKIE_SECRET));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('SweetIPO API')
    .setDescription('SweetIPO 개발을 위한 API 문서입니다.')
    .setVersion('1.0')
    .addCookieAuth('connect.sid')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 8000;
  await app.listen(port);
  console.log(`listening on port ${port}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
