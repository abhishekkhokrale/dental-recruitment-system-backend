import { Controller, Get, UseGuards, Request } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { StatsService } from './stats.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'

@ApiTags('stats')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('admin')
  @Roles('admin')
  @ApiOperation({ summary: 'Admin dashboard stats' })
  getAdminStats() {
    return this.statsService.getAdminStats()
  }

  @Get('clinic')
  @Roles('clinic')
  @ApiOperation({ summary: 'Clinic dashboard stats for logged-in clinic' })
  getClinicStats(@Request() req: any) {
    return this.statsService.getClinicStats(req.user.id)
  }
}
