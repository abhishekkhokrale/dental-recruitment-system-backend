import { IsIn } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { ApplicationStatus } from '../entities/application.entity'

export class UpdateStatusDto {
  @ApiProperty({ enum: ['applied', 'reviewing', 'interview', 'offered', 'rejected', 'withdrawn'] })
  @IsIn(['applied', 'reviewing', 'interview', 'offered', 'rejected', 'withdrawn'])
  status: ApplicationStatus
}
