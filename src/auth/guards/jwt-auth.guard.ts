import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

// Swagger에서 Bearer 토큰 인증을 사용하도록 설정
@ApiBearerAuth()
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
