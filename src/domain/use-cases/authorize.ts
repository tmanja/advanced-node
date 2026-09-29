import { TokenValidator } from '@/domain/contracts/crypto'

type Input = { token: string }
type Output = string

export type Authorize = (params: Input) => Output
type Setup = (crypto: TokenValidator) => Authorize

export const setupAuthorize: Setup = crypto => ({ token }) => {
  const userId = crypto.validateToken({ token })
  return userId
}