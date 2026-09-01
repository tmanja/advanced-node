import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '../contacts/apis'
import { LoadUserAccountRepository } from '../contacts/repositories/user-account'

export class FacebookAuthenticationServer {
  constructor (
    private readonly loadFacebookUserApi: LoadFacebookUserApi,
    private readonly loadUserAccountRepository: LoadUserAccountRepository
  ) {}

  async perform(params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const facebookUserData = await this.loadFacebookUserApi.loadUser({ accessToken: params.accessToken })
    if (facebookUserData) {
      await this.loadUserAccountRepository.load({ email: facebookUserData.email })
    }
    return new AuthenticationError()
  }
}