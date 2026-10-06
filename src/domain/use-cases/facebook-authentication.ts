import { AuthenticationError } from '@/domain/entities/errors'
import { LoadFacebookUser } from '../contracts/gateways'
import { LoadUserAccount, SaveFacebookAccount } from '../contracts/repositories/user-account'
import { AccessToken, FacebookAccount } from '@/domain/entities'
import { TokenGenerator } from '../contracts/crypto'

type Input = { token: string }
type Output = { accessToken: string }

export type FacebookAuthentication = (params: Input) => Promise<Output>

type Setup = (
  facebook: LoadFacebookUser,
  userAccountRepository: LoadUserAccount & SaveFacebookAccount,
  token: TokenGenerator
) => FacebookAuthentication

export const setupFacebookAuthentication: Setup = (
  facebook, userAccountRepository, crypto
): FacebookAuthentication => async ({ token }) => {
  const facebookUser = await facebook.loadUser({ token })
  if (facebookUser) {
    const userAccount = await userAccountRepository.load({ email: facebookUser.email })
    const { id } = await userAccountRepository.saveWithFacebook(
      new FacebookAccount(facebookUser, userAccount)
    )
    const accessToken = crypto.generateToken({
      key: id,
      expirationInMs: AccessToken.expirationInMs
    })
    return { accessToken }
  }
  throw new AuthenticationError()
}