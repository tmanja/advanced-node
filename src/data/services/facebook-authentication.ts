import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '../contacts/apis'

export class FacebookAuthenticationServer {
  constructor (
    private readonly LoadFacebookUserApi: LoadFacebookUserApi
  ) {}

  async perform(params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    await this.LoadFacebookUserApi.loadUser({ accessToken: params.accessToken })
    return new AuthenticationError()
  }
}