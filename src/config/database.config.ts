import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'
import { SnakeNamingStrategy } from './snake-naming.strategy'

export const databaseConfig = (config: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: config.get('DB_HOST', 'localhost'),
  port: config.get<number>('DB_PORT', 5432),
  username: config.get('DB_USER', 'postgres'),
  password: config.get('DB_PASSWORD', 'postgres'),
  database: config.get('DB_NAME', 'dental_recruitment'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
 // dropSchema: config.get('NODE_ENV') === 'development',  // ⚠️ DROP+RECREATE on every boot — remove after first clean start
  synchronize: config.get('NODE_ENV') === 'development', // auto-migrate in dev only
  logging: config.get('NODE_ENV') === 'development',
  ssl: config.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
  namingStrategy: new SnakeNamingStrategy(),
})
