import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { ClinicsService } from './clinics.service'
import { CreateClinicDto } from './dto/create-clinic.dto'
import { UpdateClinicDto } from './dto/update-clinic.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { User } from '../users/entities/user.entity'

@ApiTags('clinics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clinics')
export class ClinicsController {
  constructor(private readonly clinicsService: ClinicsService) {}

  @Get()
  @Roles('admin')
  findAll() {
    return this.clinicsService.findAll()
  }

  @Get('me')
  @Roles('clinic')
  getMyClinic(@CurrentUser() user: User) {
    return this.clinicsService.findByUser(user.id)
  }

  @Get(':id')
  @Roles('admin')
  findOne(@Param('id') id: string) {
    return this.clinicsService.findOne(id)
  }

  @Post()
  @Roles('clinic')
  create(@CurrentUser() user: User, @Body() dto: CreateClinicDto) {
    return this.clinicsService.create(user.id, dto)
  }

  @Patch(':id')
  @Roles('clinic', 'admin')
  update(@Param('id') id: string, @Body() dto: UpdateClinicDto) {
    return this.clinicsService.update(id, dto)
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.clinicsService.remove(id)
  }
}
