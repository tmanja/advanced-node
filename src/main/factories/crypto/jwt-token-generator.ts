import { JwtTokenGenerator } from '@/infra/crypto'
import { env } from '@/main/config/env'

export function makeJwtTokenGenerator (): JwtTokenGenerator {
  return new JwtTokenGenerator(env.jwtSecret)
}