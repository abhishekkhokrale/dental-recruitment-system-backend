import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Clinic } from './entities/clinic.entity'
import { CreateClinicDto } from './dto/create-clinic.dto'
import { UpdateClinicDto } from './dto/update-clinic.dto'

@Injectable()
export class ClinicsService {
  constructor(@InjectRepository(Clinic) private repo: Repository<Clinic>) {}

  findAll(): Promise<Clinic[]> {
    return this.repo.find({ relations: ['user'], order: { createdAt: 'DESC' } })
  }

  async findOne(id: string): Promise<Clinic> {
    const clinic = await this.repo.findOne({ where: { id }, relations: ['user', 'jobs'] })
    if (!clinic) throw new NotFoundException('Clinic not found')
    return clinic
  }

  async findByUser(userId: string): Promise<Clinic> {
    const clinic = await this.repo.findOne({ where: { userId } })
    if (!clinic) throw new NotFoundException('Clinic not found')
    return clinic
  }

  async create(userId: string, dto: CreateClinicDto): Promise<Clinic> {
    const clinic = this.repo.create({ ...dto, userId })
    return this.repo.save(clinic)
  }

  async update(id: string, dto: UpdateClinicDto): Promise<Clinic> {
    const clinic = await this.findOne(id)
    Object.assign(clinic, dto)
    return this.repo.save(clinic)
  }

  async remove(id: string): Promise<void> {
    const clinic = await this.findOne(id)
    await this.repo.remove(clinic)
  }
}
