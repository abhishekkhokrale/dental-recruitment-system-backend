import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'

export const databaseConfig = (config: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: config.get('DB_HOST', 'localhost'),
  port: config.get<number>('DB_PORT', 5432),
  username: config.get('DB_USER', 'postgres'),
  password: config.get('DB_PASSWORD', 'postgres'),
  database: config.get('DB_NAME', 'dental_recruitment'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false, // schema already created via SQL script
  logging: config.get('NODE_ENV') === 'development',
})
