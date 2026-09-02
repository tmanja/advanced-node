import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '../contacts/apis'
import { CreateFacebokAccountRepository, LoadUserAccountRepository } from '../contacts/repositories/user-account'

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository: LoadUserAccountRepository & CreateFacebokAccountRepository,
  ) {}

  async perform(params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const facebookUserData = await this.facebookApi.loadUser({ accessToken: params.accessToken })
    if (facebookUserData) {
      await this.userAccountRepository.load({ email: facebookUserData.email })
      await this.userAccountRepository.createFromFacebook(facebookUserData)
    }
    return new AuthenticationError()
  }
}