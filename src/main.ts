import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// api-docs(scalar)
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Wearther Backend')
    .setDescription('Wearther 서비스의 API 문서입니다.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.use(
    '/docs',
    apiReference({
      spec: {
        content: document,
      },
    }),
  );

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
