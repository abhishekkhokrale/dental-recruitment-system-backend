import { IsOptional, IsString, IsInt, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class SearchJobDto {
  @ApiPropertyOptional() @IsOptional() @IsString() q?: string
  @ApiPropertyOptional() @IsOptional() @IsString() prefecture?: string
  @ApiPropertyOptional() @IsOptional() @IsString() jobType?: string
  @ApiPropertyOptional() @IsOptional() @IsString() employmentType?: string
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(0) limit?: number
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(0) offset?: number
}
