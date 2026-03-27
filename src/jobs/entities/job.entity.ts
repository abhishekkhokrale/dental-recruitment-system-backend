import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany,
} from 'typeorm'
import { Clinic } from '../../clinics/entities/clinic.entity'
import { Application } from '../../applications/entities/application.entity'

export type JobType = '歯科衛生士' | '歯科医師' | '歯科助手' | '歯科技工士' | '受付・事務'
export type EmploymentType = '正社員' | 'パート・アルバイト' | '契約社員' | '派遣社員'
export type SalaryType = '月給' | '時給' | '年収'

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  title: string

  @Column({ type: 'enum', enum: ['歯科衛生士', '歯科医師', '歯科助手', '歯科技工士', '受付・事務'] })
  jobType: JobType

  @Column({ type: 'enum', enum: ['正社員', 'パート・アルバイト', '契約社員', '派遣社員'] })
  employmentType: EmploymentType

  @Column()
  prefecture: string

  @Column({ nullable: true })
  city: string

  @Column({ nullable: true })
  address: string

  @Column()
  salaryMin: number

  @Column()
  salaryMax: number

  @Column({ type: 'enum', enum: ['月給', '時給', '年収'], default: '月給' })
  salaryType: SalaryType

  @Column('text')
  description: string

  @Column('simple-array', { nullable: true })
  requirements: string[]

  @Column('simple-array', { nullable: true })
  benefits: string[]

  @Column({ nullable: true })
  workingHours: string

  @Column({ nullable: true })
  holidays: string

  @Column({ type: 'date', nullable: true })
  deadline: string

  @Column({ default: true })
  isActive: boolean

  @Column({ default: 0 })
  viewCount: number

  @Column({ default: 0 })
  applicationCount: number

  @CreateDateColumn()
  postedAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  // Relations
  @ManyToOne(() => Clinic, (clinic) => clinic.jobs)
  @JoinColumn()
  clinic: Clinic

  @Column()
  clinicId: string

  @OneToMany(() => Application, (app) => app.job)
  applications: Application[]
}
