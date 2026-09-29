import { TokenGenerator, TokenValidator } from '@/domain/contracts/crypto'
import { JwtPayload, sign, verify } from 'jsonwebtoken'

export class JwtTokenHandler implements TokenGenerator, TokenValidator {
  constructor (private readonly secret: string) {}
  generateToken ({ key, expirationInMs }: TokenGenerator.Input): TokenGenerator.Output {
    const expirationInSeconds = expirationInMs / 1000
    const token = sign({ key: key }, this.secret, { expiresIn: expirationInSeconds})
    return token
  }

  validateToken ({ token }: TokenValidator.Input): TokenValidator.Output {
    const payload = verify(token, this.secret) as JwtPayload
    return payload.key
  }
}