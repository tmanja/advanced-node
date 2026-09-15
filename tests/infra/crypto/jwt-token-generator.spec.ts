import { TokenGenerator } from '@/data/contacts/crypto'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')

class JwtTokenGenerator implements TokenGenerator {
  constructor (private readonly secret: string) {}
  generateToken (params: TokenGenerator.Params): TokenGenerator.Result {
    const expirationInSeconds = params.expirationInMs / 1000
    const token = jwt.sign({ key: params.key }, this.secret, { expiresIn: expirationInSeconds})
    return token
  }
}

describe('JwtTokenGenerator', () => {
  let sut: JwtTokenGenerator
  let fakeJwt: jest.Mocked<typeof jwt>

  beforeAll(() => {
    fakeJwt = jwt as jest.Mocked<typeof jwt>
    fakeJwt.sign.mockImplementation(() => 'any_token')
  })

  beforeEach(() => {
    sut = new JwtTokenGenerator('any_secret')
  })

  it('should call sign with correct params', () => {
    sut.generateToken({ key: 'any_key', expirationInMs: 1000 })

    expect(fakeJwt.sign).toHaveBeenCalledWith({ key: 'any_key' }, 'any_secret', { expiresIn: 1 })
  })

  it('should return a token', () => {
    const token = sut.generateToken({ key: 'any_key', expirationInMs: 1000 })

    expect(token).toEqual('any_token')
  })

  it('should rethrow if sign throws', () => {
    fakeJwt.sign.mockImplementationOnce(() => {
      throw new Error('token_error')
    })

    expect(() => sut.generateToken({ key: 'any_key', expirationInMs: 1000 })).toThrow(new Error('token_error'))
  })
})