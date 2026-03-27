import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, ILike } from 'typeorm'
import { Inject } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { Job } from './entities/job.entity'
import { CreateJobDto } from './dto/create-job.dto'
import { UpdateJobDto } from './dto/update-job.dto'
import { SearchJobDto } from './dto/search-job.dto'

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job) private repo: Repository<Job>,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async search(dto: SearchJobDto): Promise<Job[]> {
    const cacheKey = `jobs:search:${JSON.stringify(dto)}`
    const cached = await this.cache.get<Job[]>(cacheKey)
    if (cached) return cached

    const where: any = { isActive: true }
    if (dto.q) where.title = ILike(`%${dto.q}%`)
    if (dto.prefecture) where.prefecture = dto.prefecture
    if (dto.jobType) where.jobType = dto.jobType
    if (dto.employmentType) where.employmentType = dto.employmentType

    const jobs = await this.repo.find({
      where,
      relations: ['clinic'],
      order: { postedAt: 'DESC' },
      take: dto.limit ?? 20,
      skip: dto.offset ?? 0,
    })

    await this.cache.set(cacheKey, jobs, 300) // cache 5 min
    return jobs
  }

  async findOne(id: string): Promise<Job> {
    const job = await this.repo.findOne({ where: { id }, relations: ['clinic'] })
    if (!job) throw new NotFoundException('Job not found')
    await this.repo.increment({ id }, 'viewCount', 1)
    return job
  }

  async create(clinicId: string, dto: CreateJobDto): Promise<Job> {
    const job = this.repo.create({ ...dto, clinicId })
    return this.repo.save(job)
  }

  async update(id: string, dto: UpdateJobDto): Promise<Job> {
    const job = await this.findOne(id)
    Object.assign(job, dto)
    return this.repo.save(job)
  }

  async remove(id: string): Promise<void> {
    const job = await this.findOne(id)
    await this.repo.remove(job)
  }

  findByClinic(clinicId: string): Promise<Job[]> {
    return this.repo.find({ where: { clinicId }, order: { postedAt: 'DESC' } })
  }
}
