import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcryptjs'
import { User } from './entities/user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.repo.findOne({ where: { email: dto.email } })
    if (existing) throw new ConflictException('Email already registered')

    const password = await bcrypt.hash(dto.password, 10)
    const user = this.repo.create({ ...dto, password })
    return this.repo.save(user)
  }

  findAll(): Promise<User[]> {
    return this.repo.find({ select: ['id', 'name', 'email', 'role', 'isActive', 'createdAt'] })
  }

  async findById(id: string): Promise<User> {
    const user = await this.repo.findOne({ where: { id } })
    if (!user) throw new NotFoundException('User not found')
    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } })
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id)
    if (dto.password) {
      dto['password'] = await bcrypt.hash(dto.password, 10)
      delete dto.password
    }
    Object.assign(user, dto)
    return this.repo.save(user)
  }

  async remove(id: string): Promise<void> {
    const user = await this.findById(id)
    await this.repo.remove(user)
  }

  async validatePassword(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email)
    if (!user) return null
    const valid = await bcrypt.compare(password, user.password)
    return valid ? user : null
  }
}
