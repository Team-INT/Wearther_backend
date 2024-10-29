import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/email')
  loginEmail(@Headers('authorization') rawToken: string) {}

  @Post('register/email')
  registerEmail(
    @Body('username') username: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {}
}
