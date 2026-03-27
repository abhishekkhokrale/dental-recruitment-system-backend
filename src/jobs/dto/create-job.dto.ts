import { IsString, IsInt, IsArray, IsOptional, IsBoolean, IsIn } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { JobType, EmploymentType, SalaryType } from '../entities/job.entity'

export class CreateJobDto {
  @ApiProperty() @IsString() title: string
  @ApiProperty() @IsIn(['歯科衛生士', '歯科医師', '歯科助手', '歯科技工士', '受付・事務']) jobType: JobType
  @ApiProperty() @IsIn(['正社員', 'パート・アルバイト', '契約社員', '派遣社員']) employmentType: EmploymentType
  @ApiProperty() @IsString() prefecture: string
  @ApiPropertyOptional() @IsOptional() @IsString() city?: string
  @ApiPropertyOptional() @IsOptional() @IsString() address?: string
  @ApiProperty() @IsInt() salaryMin: number
  @ApiProperty() @IsInt() salaryMax: number
  @ApiProperty() @IsIn(['月給', '時給', '年収']) salaryType: SalaryType
  @ApiProperty() @IsString() description: string
  @ApiPropertyOptional() @IsOptional() @IsArray() requirements?: string[]
  @ApiPropertyOptional() @IsOptional() @IsArray() benefits?: string[]
  @ApiPropertyOptional() @IsOptional() @IsString() workingHours?: string
  @ApiPropertyOptional() @IsOptional() @IsString() holidays?: string
  @ApiPropertyOptional() @IsOptional() @IsString() deadline?: string
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean
}
