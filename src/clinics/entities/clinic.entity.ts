import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { Job } from '../../jobs/entities/job.entity'

export type ClinicStatus = 'active' | 'pending' | 'suspended'

@Entity('clinics')
export class Clinic {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  clinicName: string

  @Column()
  prefecture: string

  @Column({ nullable: true })
  city: string

  @Column({ nullable: true })
  address: string

  @Column({ nullable: true })
  phone: string

  @Column({ nullable: true })
  website: string

  @Column({ nullable: true })
  description: string

  @Column({ nullable: true })
  logoUrl: string

  @Column({ type: 'enum', enum: ['active', 'pending', 'suspended'], default: 'pending' })
  status: ClinicStatus

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  // Relations
  @OneToOne(() => User, (user) => user.clinic)
  @JoinColumn()
  user: User

  @Column()
  userId: string

  @OneToMany(() => Job, (job) => job.clinic)
  jobs: Job[]
}
