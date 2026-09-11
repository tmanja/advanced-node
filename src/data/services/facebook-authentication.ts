import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '../contacts/apis'
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '../contacts/repositories/user-account'
import { AccessToken, FacebooAccount } from '@/domain/models'
import { TokenGenerator } from '../contacts/crypto'

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository:
      LoadUserAccountRepository &
      SaveFacebookAccountRepository,
    private readonly crypto: TokenGenerator,
  ) {}

  async perform(params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const facebookUser = await this.facebookApi.loadUser({ accessToken: params.accessToken })
    if (facebookUser) {
      const userAccount = await this.userAccountRepository.load({ email: facebookUser.email })
      const { id } = await this.userAccountRepository.saveWithFacebook(
        new FacebooAccount(facebookUser, userAccount)
      )
      await this.crypto.generateToken({
        key: id,
        expirationInMs: AccessToken.expirationInMs
      })
    }
    return new AuthenticationError()
  }
}