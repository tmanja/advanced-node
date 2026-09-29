import { AuthenticationError } from '@/domain/entities/errors'
import { LoadFacebookUserApi } from '../contracts/apis'
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '../contracts/repositories/user-account'
import { AccessToken, FacebookAccount } from '@/domain/entities'
import { TokenGenerator } from '../contracts/crypto'

type Input = { token: string }
type Output = { accessToken: string }

export type FacebookAuthentication = (params: Input) => Promise<Output>

type Setup = (
  facebookApi: LoadFacebookUserApi,
  userAccountRepository: LoadUserAccountRepository & SaveFacebookAccountRepository,
  crypto: TokenGenerator
) => FacebookAuthentication



export const setupFacebookAuthentication: Setup = (
  facebookApi, userAccountRepository, crypto
): FacebookAuthentication => async ({ token }) => {
  const facebookUser = await facebookApi.loadUser({ token })
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