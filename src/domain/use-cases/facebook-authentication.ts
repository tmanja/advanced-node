import { AuthenticationError } from '@/domain/entities/errors'
import { LoadFacebookUserApi } from '../contracts/apis'
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '../contracts/repositories/user-account'
import { AccessToken, FacebookAccount } from '@/domain/entities'
import { TokenGenerator } from '../contracts/crypto'

export type FacebookAuthentication = (params: { token: string }) => Promise<AccessToken | AuthenticationError>

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
    return new AccessToken(accessToken)
  }
  return new AuthenticationError()
}