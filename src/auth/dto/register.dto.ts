import { IsEmail, IsString, MinLength, IsIn, IsOptional } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { UserRole } from '../../users/entities/user.entity'

export class RegisterDto {
  @ApiProperty({ example: '田中 太郎' })
  @IsString()
  name: string

  @ApiProperty({ example: 'tanaka@example.com' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'password123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string

  @ApiPropertyOptional({ enum: ['seeker', 'clinic'], default: 'seeker' })
  @IsOptional()
  @IsIn(['seeker', 'clinic'])
  role?: UserRole
}
