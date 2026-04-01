import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { Job } from '../../jobs/entities/job.entity'

export type ApplicationStatus = 'applied' | 'reviewing' | 'interview' | 'offered' | 'rejected' | 'withdrawn'

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'text', default: 'applied' })
  status: ApplicationStatus

  @Column({ type: 'text', nullable: true })
  message: string | null

  @Column({ type: 'text', nullable: true, name: 'resumeurl' })
  resumeUrl: string | null

  @Column({ type: 'uuid', name: 'seekerid' })
  seekerId: string

  @Column({ type: 'uuid', name: 'jobid' })
  jobId: string

  @CreateDateColumn({ name: 'appliedat' })
  appliedAt: Date

  @UpdateDateColumn({ name: 'updatedat' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deletedat', nullable: true })
  deletedAt: Date | null

  @ManyToOne(() => User, (user) => user.applications)
  @JoinColumn({ name: 'seekerid' })
  seeker: User

  @ManyToOne(() => Job, (job) => job.applications)
  @JoinColumn({ name: 'jobid' })
  job: Job
}
