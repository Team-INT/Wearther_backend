import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// api-docs(scalar)
import { apiReference } from '@scalar/nestjs-api-reference';
import { setupSwagger } from 'swagger.config';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Swagger 설정 적용
  const document = setupSwagger(app);

  app.useGlobalFilters(new AllExceptionsFilter());
  app.use(
    '/docs',
    apiReference({
      spec: {
        content: document,
      },
    }),
  );

  app.enableShutdownHooks();

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
