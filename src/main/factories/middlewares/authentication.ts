import { AuthenticationMiddleware } from '@/application/middlewares'
import { setupAuthorize } from '@/domain/use-cases'
import { makeJwtTokenHandler } from '../crypto'

export function makeAuthenticationMiddleware  (): AuthenticationMiddleware {
  const authorize = setupAuthorize(makeJwtTokenHandler())
  return new AuthenticationMiddleware(authorize)
}