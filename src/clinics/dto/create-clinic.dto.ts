import { IsString, IsOptional } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateClinicDto {
  @ApiProperty() @IsString() clinicName: string
  @ApiProperty() @IsString() prefecture: string
  @ApiPropertyOptional() @IsOptional() @IsString() city?: string
  @ApiPropertyOptional() @IsOptional() @IsString() address?: string
  @ApiPropertyOptional() @IsOptional() @IsString() phone?: string
  @ApiPropertyOptional() @IsOptional() @IsString() website?: string
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string
}
