import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiErrorDetail {
  @ApiProperty({ example: 404 })
  statusCode: number;

  @ApiProperty({ example: 'NotFoundException' })
  code: string;

  @ApiProperty({ example: 'User with id "abc" not found' })
  message: string;
}

export class ApiSuccessResponse<T> {
  @ApiProperty({ example: true })
  success: true;

  @ApiProperty()
  data: T;

  @ApiProperty({ example: '2026-03-24T12:00:00.000Z' })
  timestamp: string;
}

export class ApiErrorResponse {
  @ApiProperty({ example: false })
  success: false;

  @ApiProperty({ type: ApiErrorDetail })
  error: ApiErrorDetail;

  @ApiProperty({ example: '2026-03-24T12:00:00.000Z' })
  timestamp: string;
}

export class ApiPaginatedResponse<T> {
  @ApiProperty({ example: true })
  success: true;

  @ApiProperty()
  data: T[];

  @ApiPropertyOptional()
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };

  @ApiProperty({ example: '2026-03-24T12:00:00.000Z' })
  timestamp: string;
}
