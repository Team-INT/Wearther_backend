// nest common
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// TypeORM
import { TypeOrmModule } from '@nestjs/typeorm';

// constants
import {
  ENV_POSTGRES_DATABASE_KEY,
  ENV_POSTGRES_PASSWORD_KEY,
  ENV_POSTGRES_USERNAME_KEY,
  ENV_POSTGRES_PORT_KEY,
  ENV_POSTGRES_HOST_KEY,
} from './common/constant/env-keys.const';

// entity
import { PostsModel } from './posts/entities/post.entity';
import { UsersModel } from './users/entities/users.entity';
import { WeatherModel } from './weather/entities/weather.entity';

// module
import { TrendModule } from './trend/trend.module';
import { RecommendationModule } from './recommendation/recommendation.module';
import { CommunityModule } from './community/community.module';
import { ProductModule } from './product/product.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { WeatherModule } from './weather/weather.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [PostsModel, UsersModel, WeatherModel],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    WeatherModule,
    TrendModule,
    RecommendationModule,
    CommunityModule,
    ProductModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
