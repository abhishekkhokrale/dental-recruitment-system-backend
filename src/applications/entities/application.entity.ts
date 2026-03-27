import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { Job } from '../../jobs/entities/job.entity'

export type ApplicationStatus =
  | 'applied'      // 応募済み
  | 'reviewing'    // 書類選考中
  | 'interview'    // 面接調整中
  | 'offered'      // 内定
  | 'rejected'     // 不採用
  | 'withdrawn'    // 辞退

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    type: 'enum',
    enum: ['applied', 'reviewing', 'interview', 'offered', 'rejected', 'withdrawn'],
    default: 'applied',
  })
  status: ApplicationStatus

  @Column('text', { nullable: true })
  message: string

  @Column('text', { nullable: true })
  resumeUrl: string

  @CreateDateColumn()
  appliedAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  // Relations
  @ManyToOne(() => User, (user) => user.applications)
  @JoinColumn()
  seeker: User

  @Column()
  seekerId: string

  @ManyToOne(() => Job, (job) => job.applications)
  @JoinColumn()
  job: Job

  @Column()
  jobId: string
}
