import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CacheModule } from '@nestjs/cache-manager'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { ClinicsModule } from './clinics/clinics.module'
import { JobsModule } from './jobs/jobs.module'
import { ApplicationsModule } from './applications/applications.module'
import { StatsModule } from './stats/stats.module'
import { databaseConfig } from './config/database.config'
import { redisConfig } from './config/redis.config'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: databaseConfig,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: redisConfig,
    }),
    AuthModule,
    UsersModule,
    ClinicsModule,
    JobsModule,
    ApplicationsModule,
    StatsModule,
  ],
})
export class AppModule {}
