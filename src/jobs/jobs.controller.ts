import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger'
import { JobsService } from './jobs.service'
import { CreateJobDto } from './dto/create-job.dto'
import { UpdateJobDto } from './dto/update-job.dto'
import { SearchJobDto } from './dto/search-job.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { User } from '../users/entities/user.entity'

@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  // Public: search jobs
  @Get()
  @ApiOperation({ summary: 'Search job listings' })
  search(@Query() dto: SearchJobDto) {
    return this.jobsService.search(dto)
  }

  // Public: job detail
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id)
  }

  // Clinic: post new job
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('clinic', 'admin')
  create(@CurrentUser() user: User, @Body() dto: CreateJobDto) {
    return this.jobsService.create(user.clinic?.id, dto)
  }

  // Clinic: update own job
  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('clinic', 'admin')
  update(@Param('id') id: string, @Body() dto: UpdateJobDto) {
    return this.jobsService.update(id, dto)
  }

  // Clinic / Admin: delete job
  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('clinic', 'admin')
  remove(@Param('id') id: string) {
    return this.jobsService.remove(id)
  }
}
