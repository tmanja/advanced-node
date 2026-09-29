import { TokenGenerator, TokenValidator } from '@/domain/contracts/crypto'
import { JwtPayload, sign, verify } from 'jsonwebtoken'

export class JwtTokenHandler implements TokenGenerator, TokenValidator {
  constructor (private readonly secret: string) {}
  generateToken ({ key, expirationInMs }: TokenGenerator.Params): TokenGenerator.Result {
    const expirationInSeconds = expirationInMs / 1000
    const token = sign({ key: key }, this.secret, { expiresIn: expirationInSeconds})
    return token
  }

  validateToken ({ token }: TokenValidator.Params): TokenValidator.Result {
    const payload = verify(token, this.secret) as JwtPayload
    return payload.key
  }
}