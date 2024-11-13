import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 'user@example.com' })
  userEmail: string;

  @ApiProperty({ example: 'username' })
  username: string;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
