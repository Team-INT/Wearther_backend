import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): OpenAPIObject {
  const config = new DocumentBuilder()
    .setTitle('Wearther Backend')
    .setDescription('Wearther 서비스의 API 문서입니다.')
    .setVersion('0.1')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'access-token',
        description: 'JWT 액세스 토큰을 입력하세요',
        in: 'header',
      },
      'access-token', // 이 이름은 @ApiBearerAuth() 데코레이터에서 사용됩니다
    )
    .addServer(`http://localhost:${process.env.PORT ?? 8000}`)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  return document;
}
