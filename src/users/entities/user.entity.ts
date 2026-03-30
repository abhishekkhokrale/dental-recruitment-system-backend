import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
  OneToOne, OneToMany,
} from 'typeorm'
import { Clinic } from '../../clinics/entities/clinic.entity'
import { Application } from '../../applications/entities/application.entity'

export type UserRole = 'seeker' | 'clinic' | 'admin'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'text' })
  name: string

  @Column({ type: 'text', unique: true })
  email: string

  @Column({ type: 'text', name: 'password' })
  password: string

  @Column({ type: 'text', default: 'seeker' })
  role: UserRole

  @Column({ type: 'text', nullable: true })
  prefecture: string | null

  @Column({ type: 'text', array: true, nullable: true })
  qualifications: string[] | null

  @Column({ type: 'int', nullable: true, name: 'experienceyears' })
  experienceYears: number | null

  @Column({ type: 'text', array: true, nullable: true, name: 'employmenttypes' })
  employmentTypes: string[] | null

  @Column({ type: 'numeric', nullable: true, name: 'desiredsalarymin' })
  desiredSalaryMin: number | null

  @Column({ type: 'text', nullable: true })
  bio: string | null

  @Column({ type: 'text', default: 'email' })
  provider: string

  @Column({ type: 'text', nullable: true, name: 'lineid' })
  lineId: string | null

  @CreateDateColumn({ name: 'createdat' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updatedat' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deletedat', nullable: true })
  deletedAt: Date | null

  // Relations
  @OneToOne(() => Clinic, (clinic) => clinic.user)
  clinic: Clinic

  @OneToMany(() => Application, (app) => app.seeker)
  applications: Application[]
}
