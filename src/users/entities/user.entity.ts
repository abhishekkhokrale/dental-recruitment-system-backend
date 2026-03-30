import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany,
} from 'typeorm'
import { Clinic } from '../../clinics/entities/clinic.entity'
import { Application } from '../../applications/entities/application.entity'

export type UserRole = 'seeker' | 'clinic' | 'admin'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  email: string

  @Column()
  passwordHash: string

  @Column()
  name: string

  @Column({ type: 'enum', enum: ['seeker', 'clinic', 'admin'], default: 'seeker' })
  role: UserRole

  @Column({ nullable: true })
  avatarUrl: string

  @Column({ nullable: true })
  lineId: string

  @Column({ default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  // Relations
  @OneToOne(() => Clinic, (clinic) => clinic.user)
  clinic: Clinic

  @OneToMany(() => Application, (app) => app.seeker)
  applications: Application[]
}
