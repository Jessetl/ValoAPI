import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJSUzI1NiIs...' })
  idToken: string;

  @ApiProperty({ example: 'AMf-vBx...' })
  refreshToken: string;

  @ApiProperty({ example: '3600' })
  expiresIn: string;
}
