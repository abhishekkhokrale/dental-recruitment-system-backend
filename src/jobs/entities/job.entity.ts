import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
  ManyToOne, JoinColumn, OneToMany,
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

  @Column({ type: 'text' })
  title: string

  @Column({ type: 'text', name: 'jobtype' })
  jobType: JobType

  @Column({ type: 'text', name: 'employmenttype' })
  employmentType: EmploymentType

  @Column({ type: 'text' })
  prefecture: string

  @Column({ type: 'text', nullable: true })
  city: string | null

  @Column({ type: 'text', nullable: true })
  address: string | null

  @Column({ type: 'numeric', name: 'salarymin' })
  salaryMin: number

  @Column({ type: 'numeric', name: 'salarymax' })
  salaryMax: number

  @Column({ type: 'text', default: '月給', name: 'salarytype' })
  salaryType: SalaryType

  @Column({ type: 'text' })
  description: string

  @Column({ type: 'simple-array', nullable: true })
  requirements: string[]

  @Column({ type: 'simple-array', nullable: true })
  benefits: string[]

  @Column({ type: 'text', nullable: true, name: 'workinghours' })
  workingHours: string | null

  @Column({ type: 'text', nullable: true })
  holidays: string | null

  @Column({ type: 'date', nullable: true })
  deadline: string | null

  @Column({ type: 'boolean', default: true, name: 'isactive' })
  isActive: boolean

  @Column({ type: 'boolean', default: false, name: 'isfeatured' })
  isFeatured: boolean

  @Column({ type: 'int', default: 0, name: 'viewcount' })
  viewCount: number

  @Column({ type: 'int', default: 0, name: 'applicationcount' })
  applicationCount: number

  @CreateDateColumn({ name: 'postedat' })
  postedAt: Date

  @UpdateDateColumn({ name: 'updatedat' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deletedat', nullable: true })
  deletedAt: Date | null

  @Column({ type: 'uuid', name: 'clinicid' })
  clinicId: string

  @ManyToOne(() => Clinic, (clinic) => clinic.jobs)
  @JoinColumn({ name: 'clinicid' })
  clinic: Clinic

  @OneToMany(() => Application, (app) => app.job)
  applications: Application[]
}
