import { TokenGenerator } from '@/data/contacts/crypto'
import { sign } from 'jsonwebtoken'


export class JwtTokenGenerator implements TokenGenerator {
  constructor (private readonly secret: string) {}
  generateToken (params: TokenGenerator.Params): TokenGenerator.Result {
    const expirationInSeconds = params.expirationInMs / 1000
    const token = sign({ key: params.key }, this.secret, { expiresIn: expirationInSeconds})
    return token
  }
}