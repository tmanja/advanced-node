import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '../contacts/apis'
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '../contacts/repositories/user-account'
import { FacebooAccount } from '@/domain/models'

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository:
      LoadUserAccountRepository &
      SaveFacebookAccountRepository
  ) {}

  async perform(params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const facebookUser = await this.facebookApi.loadUser({ accessToken: params.accessToken })
    if (facebookUser) {
      const userAccount = await this.userAccountRepository.load({ email: facebookUser.email })
      await this.userAccountRepository.saveWithFacebook(
        new FacebooAccount(facebookUser, userAccount)
      )
    }
    return new AuthenticationError()
  }
}