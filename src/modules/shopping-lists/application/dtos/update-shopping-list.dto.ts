import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateShoppingListDto {
  @ApiPropertyOptional({ example: 'Compra del mes' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({ example: 'Automercado Plaza' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  storeName?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  ivaEnabled?: boolean;
}
