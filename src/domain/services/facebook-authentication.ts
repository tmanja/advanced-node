import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '../contracts/apis'
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '../contracts/repositories/user-account'
import { AccessToken, FacebookAccount } from '@/domain/models'
import { TokenGenerator } from '../contracts/crypto'

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository:
      LoadUserAccountRepository &
      SaveFacebookAccountRepository,
    private readonly crypto: TokenGenerator,
  ) {}

  async perform({ token }: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
    const facebookUser = await this.facebookApi.loadUser({ token })
    if (facebookUser) {
      const userAccount = await this.userAccountRepository.load({ email: facebookUser.email })
      const { id } = await this.userAccountRepository.saveWithFacebook(
        new FacebookAccount(facebookUser, userAccount)
      )
      const accessToken = this.crypto.generateToken({
        key: id,
        expirationInMs: AccessToken.expirationInMs
      })
      return new AccessToken(accessToken)
    }
    return new AuthenticationError()
  }
}