// nest common
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// TypeORM
import { TypeOrmModule } from '@nestjs/typeorm';

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
import { ScheduleModule } from '@nestjs/schedule';
// import { RedisModule } from '@liaoliaots/nestjs-redis';
import { OpenaiModule } from './openai/openai.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: parseInt(configService.get('POSTGRES_PORT')),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    // RedisModule.forRootAsync({
    //   useFactory: (configService: ConfigService) => ({
    //     config: {
    //       host: configService.get('REDIS_HOST'),
    //       port: parseInt(configService.get('REDIS_PORT')),
    //       password: configService.get('REDIS_PASSWORD') || undefined,
    //     },
    //   }),
    //   inject: [ConfigService],
    // }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    PostsModule,
    WeatherModule,
    TrendModule,
    RecommendationModule,
    CommunityModule,
    ProductModule,
    CommonModule,
    OpenaiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
