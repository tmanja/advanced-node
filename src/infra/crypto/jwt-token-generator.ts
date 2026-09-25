import { TokenGenerator } from '@/data/contacts/crypto'
import { sign } from 'jsonwebtoken'


export class JwtTokenGenerator implements TokenGenerator {
  constructor (private readonly secret: string) {}
  generateToken ({ key, expirationInMs }: TokenGenerator.Params): TokenGenerator.Result {
    const expirationInSeconds = expirationInMs / 1000
    const token = sign({ key: key }, this.secret, { expiresIn: expirationInSeconds})
    return token
  }
}