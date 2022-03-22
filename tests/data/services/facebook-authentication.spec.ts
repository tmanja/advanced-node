import { FacebookAuthentication } from '@/domain/features'

class FacebookAuthenticationService {
  constructor (private readonly loadFacebookUserApi: LoadFacebookUserApi) {}
  async perform (params: FacebookAuthentication.Params): Promise<void> {
    await this.loadFacebookUserApi.loadUser({ token: params.token })
  }
}

export interface LoadFacebookUserApi {
  loadUser: (params: LoadFacebookUserApi.Params) => Promise<void>
}

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: LoadFacebookUserApi.Params
  async loadUser (params: LoadFacebookUserApi.Params): Promise<void> {
    this.token = { token: params.token }
  }
}

namespace LoadFacebookUserApi {
  export type Params = { token: string }
}

describe('FacebookAuthenticationService', () => {
  it('should call LoadFacebookUserApi with correct value', async () => {
    const loadFacebookUserApi = new LoadFacebookUserApiSpy()
    const sut = new FacebookAuthenticationService(loadFacebookUserApi)
    await sut.perform({ token: 'any_token' })
    expect(loadFacebookUserApi.token).toEqual({ token: 'any_token' })
  })
})
