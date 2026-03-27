import { IsEmail, IsString, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
  @ApiProperty({ example: 'seeker@bluejobs.jp' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'seeker1234' })
  @IsString()
  @MinLength(6)
  password: string
}
