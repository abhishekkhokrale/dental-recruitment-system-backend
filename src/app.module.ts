import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CacheModule } from '@nestjs/cache-manager'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { ClinicsModule } from './clinics/clinics.module'
import { JobsModule } from './jobs/jobs.module'
import { ApplicationsModule } from './applications/applications.module'
import { databaseConfig } from './config/database.config'
import { redisConfig } from './config/redis.config'

@Module({
  imports: [
    // Config — loads .env
    ConfigModule.forRoot({ isGlobal: true }),

    // PostgreSQL via TypeORM
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: databaseConfig,
    }),

    // Redis cache
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: redisConfig,
    }),

    // Feature modules
    AuthModule,
    UsersModule,
    ClinicsModule,
    JobsModule,
    ApplicationsModule,
  ],
})
export class AppModule {}
