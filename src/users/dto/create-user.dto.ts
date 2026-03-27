import { IsEmail, IsString, MinLength, IsIn, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { UserRole } from '../entities/user.entity'

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsString()
  @MinLength(8)
  password: string

  @ApiProperty({ enum: ['seeker', 'clinic', 'admin'], default: 'seeker' })
  @IsOptional()
  @IsIn(['seeker', 'clinic', 'admin'])
  role?: UserRole
}
