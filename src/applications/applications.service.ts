import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Application, ApplicationStatus } from './entities/application.entity'
import { CreateApplicationDto } from './dto/create-application.dto'

@Injectable()
export class ApplicationsService {
  constructor(@InjectRepository(Application) private repo: Repository<Application>) {}

  apply(seekerId: string, dto: CreateApplicationDto): Promise<Application> {
    const app = this.repo.create({ ...dto, seekerId })
    return this.repo.save(app)
  }

  findBySeeker(seekerId: string): Promise<Application[]> {
    return this.repo.find({ where: { seekerId }, relations: ['job', 'job.clinic'], order: { appliedAt: 'DESC' } })
  }

  findByJob(jobId: string): Promise<Application[]> {
    return this.repo.find({ where: { jobId }, relations: ['seeker'], order: { appliedAt: 'DESC' } })
  }

  async updateStatus(id: string, status: ApplicationStatus): Promise<Application> {
    const app = await this.repo.findOne({ where: { id } })
    if (!app) throw new NotFoundException('Application not found')
    app.status = status
    return this.repo.save(app)
  }
}
