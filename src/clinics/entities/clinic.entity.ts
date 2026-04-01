import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
  OneToOne, JoinColumn, OneToMany,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { Job } from '../../jobs/entities/job.entity'

export type ClinicStatus = 'active' | 'pending' | 'suspended'

@Entity('clinics')
export class Clinic {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'text', name: 'clinicname' })
  clinicName: string

  @Column({ type: 'text' })
  prefecture: string

  @Column({ type: 'text', nullable: true })
  city: string | null

  @Column({ type: 'text', nullable: true })
  address: string | null

  @Column({ type: 'text', nullable: true })
  phone: string | null

  @Column({ type: 'text', nullable: true })
  website: string | null

  @Column({ type: 'text', nullable: true })
  description: string | null

  @Column({ type: 'text', nullable: true, name: 'logourl' })
  logoUrl: string | null

  @Column({ type: 'text', default: 'pending' })
  status: ClinicStatus

  @Column({ type: 'uuid', name: 'userid' })
  userId: string

  @CreateDateColumn({ name: 'createdat' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updatedat' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deletedat', nullable: true })
  deletedAt: Date | null

  @OneToOne(() => User, (user) => user.clinic)
  @JoinColumn({ name: 'userid' })
  user: User

  @OneToMany(() => Job, (job) => job.clinic)
  jobs: Job[]
}
