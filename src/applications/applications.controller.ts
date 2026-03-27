import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { ApplicationsService } from './applications.service'
import { CreateApplicationDto } from './dto/create-application.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { User } from '../users/entities/user.entity'
import { ApplicationStatus } from './entities/application.entity'

@ApiTags('applications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  // Seeker: apply to a job
  @Post()
  @Roles('seeker')
  apply(@CurrentUser() user: User, @Body() dto: CreateApplicationDto) {
    return this.applicationsService.apply(user.id, dto)
  }

  // Seeker: my applications
  @Get('mine')
  @Roles('seeker')
  myApplications(@CurrentUser() user: User) {
    return this.applicationsService.findBySeeker(user.id)
  }

  // Clinic: applicants for a specific job
  @Get('job/:jobId')
  @Roles('clinic', 'admin')
  byJob(@Param('jobId') jobId: string) {
    return this.applicationsService.findByJob(jobId)
  }

  // Clinic: update application status (ATS)
  @Patch(':id/status')
  @Roles('clinic', 'admin')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: ApplicationStatus,
  ) {
    return this.applicationsService.updateStatus(id, status)
  }
}
