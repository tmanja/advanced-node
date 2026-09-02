import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '../contacts/apis'
import { CreateFacebokAccountRepository, LoadUserAccountRepository } from '../contacts/repositories/user-account'

export class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookUserApi: LoadFacebookUserApi,
    private readonly loadUserAccountRepository: LoadUserAccountRepository,
    private readonly creatFacebookAccountRepository: CreateFacebokAccountRepository
  ) {}

  async perform(params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const facebookUserData = await this.loadFacebookUserApi.loadUser({ accessToken: params.accessToken })
    if (facebookUserData) {
      await this.loadUserAccountRepository.load({ email: facebookUserData.email })
      await this.creatFacebookAccountRepository.createFromFacebook(facebookUserData)
    }
    return new AuthenticationError()
  }
}