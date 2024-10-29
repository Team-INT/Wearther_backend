import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { WeatherModule } from './weather/weather.module';

// TypeORM
import { TypeOrmModule } from '@nestjs/typeorm';

// entity
import { PostModel } from './posts/entities/post.entity';
import { UserModel } from './users/entities/user.entity';
import { WeatherModel } from './weather/entities/weather.entity';
import { TrendModule } from './trend/trend.module';
import { RecommendationModule } from './recommendation/recommendation.module';
import { CommunityModule } from './community/community.module';
import { ProductModule } from './product/product.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [PostModel, UserModel, WeatherModel],
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
