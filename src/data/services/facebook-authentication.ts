import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '../contacts/apis'
import { CreateFacebokAccountRepository, LoadUserAccountRepository, UpdateFacebookAccountRepository } from '../contacts/repositories/user-account'

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository:
      LoadUserAccountRepository &
      CreateFacebokAccountRepository &
      UpdateFacebookAccountRepository
  ) {}

  async perform(params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const facebookUserData = await this.facebookApi.loadUser({ accessToken: params.accessToken })
    if (facebookUserData) {
      const userAccountData = await this.userAccountRepository.load({ email: facebookUserData.email })
      if (userAccountData) {
        await this.userAccountRepository.updateWithFacebook({
          id: userAccountData.id,
          name: userAccountData.name ?? facebookUserData.name,
          facebookId: facebookUserData.facebookId
        })
      } else {
        await this.userAccountRepository.createFromFacebook(facebookUserData)
      }
    }
    return new AuthenticationError()
  }
}