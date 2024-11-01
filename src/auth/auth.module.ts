import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

// auth
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

// users
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    UsersModule,
  ],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
