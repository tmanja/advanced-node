import { TokenGenerator, TokenValidator } from '@/domain/contracts/crypto'
import { sign, verify } from 'jsonwebtoken'

export class JwtTokenHandler implements TokenGenerator {
  constructor (private readonly secret: string) {}
  generateToken ({ key, expirationInMs }: TokenGenerator.Params): TokenGenerator.Result {
    const expirationInSeconds = expirationInMs / 1000
    const token = sign({ key: key }, this.secret, { expiresIn: expirationInSeconds})
    return token
  }

  validateToken ({ token }: TokenValidator.Params): void {
    verify(token, this.secret)
  }
}