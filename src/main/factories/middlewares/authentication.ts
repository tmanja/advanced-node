import { AuthenticationMiddleware } from '@/application/middlewares'
import { makeJwtTokenHandler } from '@/main/factories/crypto'

export function makeAuthenticationMiddleware  (): AuthenticationMiddleware {
  const jwtTokenHandler = makeJwtTokenHandler()
  return new AuthenticationMiddleware(jwtTokenHandler.validateToken.bind(jwtTokenHandler))
}