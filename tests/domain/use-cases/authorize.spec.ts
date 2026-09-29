import { mock, MockProxy } from 'jest-mock-extended'

export interface TokenValidator {
  validateToken: (params: TokenValidator.Params) => TokenValidator.Result
}

export namespace TokenValidator {
  export type Params = { token : string }
  export type Result = string
}

type Input = { token: string }
type Output = string

type Authorize = (params: Input) => Output

type Setup = (crypto: TokenValidator) => Authorize

const setupAuthorize: Setup = crypto => ({ token }) => {
  const userId = crypto.validateToken({ token })
  return userId
}

describe('Authorize', () => {
  let crypto: MockProxy<TokenValidator>
  let sut: Authorize
  let token: string

  beforeAll(() => {
    token = 'any_token'
    crypto = mock()
    crypto.validateToken.mockReturnValue('any_user_id')
  })

  beforeEach(() => {
    sut = setupAuthorize(crypto)
  })

  it('should call TokenValidator with correct params', () => {
    sut({ token })

    expect(crypto.validateToken).toHaveBeenCalledWith({ token })
    expect(crypto.validateToken).toHaveBeenCalledTimes(1)
  })

  it('should return user id', () => {
    const userId = sut({ token })

    expect(userId).toBe('any_user_id')
  })
})