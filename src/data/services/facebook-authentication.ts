import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '../contacts/apis'
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '../contacts/repositories/user-account'

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository:
      LoadUserAccountRepository &
      SaveFacebookAccountRepository
  ) {}

  async perform(params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const facebookUserData = await this.facebookApi.loadUser({ accessToken: params.accessToken })
    if (facebookUserData) {
      const userAccountData = await this.userAccountRepository.load({ email: facebookUserData.email })
      await this.userAccountRepository.saveWithFacebook({
        id: userAccountData?.id,
        name: userAccountData?.name ?? facebookUserData.name,
        email: facebookUserData.email,
        facebookId: facebookUserData.facebookId
      })
    }
    return new AuthenticationError()
  }
}