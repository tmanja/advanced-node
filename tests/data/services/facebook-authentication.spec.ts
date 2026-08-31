import { FacebookAuthentication } from '@/domain/features'

class FacebookAuthenticationServer {
  constructor (
    private readonly LoadFacebookUserApi: LoadFacebookUserApi
  ) {}

  async perform(params: FacebookAuthentication.Params): Promise<void> {
    await this.LoadFacebookUserApi.loadUser({ accessToken: params.accessToken })
  }
}

interface LoadFacebookUserApi {
  loadUser: (params: LoadFacebookUserApi.Params) => Promise<void>
}

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string

  async loadUser(params: LoadFacebookUserApi.Params): Promise<void> {
    this.token = params.accessToken
  }
}

namespace LoadFacebookUserApi {
  export type Params = {
    accessToken: string
  }
}

describe('FacebookAuthenticationService', () => {
  it('should call LoadFacebookUserApi with correct params', async () => {
    const loadFacebookUserApi = new LoadFacebookUserApiSpy()
    const sut = new FacebookAuthenticationServer(loadFacebookUserApi)
    await sut.perform({ accessToken: 'any_token' })
    expect(loadFacebookUserApi.token).toBe('any_token')
  })
})