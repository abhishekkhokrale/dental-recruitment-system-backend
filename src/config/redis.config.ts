import { ConfigService } from '@nestjs/config'

export const redisConfig = (config: ConfigService) => ({
  store: 'ioredis',
  host: config.get('REDIS_HOST', 'localhost'),
  port: config.get<number>('REDIS_PORT', 6379),
  password: config.get('REDIS_PASSWORD', ''),
  ttl: 60 * 5, // default TTL: 5 minutes
})
