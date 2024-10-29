import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// api-docs(scalar)
import { apiReference } from '@scalar/nestjs-api-reference';
import { setupSwagger } from 'swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger 설정 적용
  const document = setupSwagger(app);

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
