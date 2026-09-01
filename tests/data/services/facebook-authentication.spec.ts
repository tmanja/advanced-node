import { LoadFacebookUserApi } from '@/data/contacts/apis'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'

class FacebookAuthenticationServer {
  constructor (
    private readonly LoadFacebookUserApi: LoadFacebookUserApi
  ) {}

  async perform(params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    await this.LoadFacebookUserApi.loadUser({ accessToken: params.accessToken })
    return new AuthenticationError()
  }
}

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string
  result: undefined

  async loadUser(params: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
    this.token = params.accessToken
    return this.result
  }
}



describe('FacebookAuthenticationService', () => {
  it('should call LoadFacebookUserApi with correct params', async () => {
    const loadFacebookUserApi = new LoadFacebookUserApiSpy()
    const sut = new FacebookAuthenticationServer(loadFacebookUserApi)
    await sut.perform({ accessToken: 'any_token' })
    expect(loadFacebookUserApi.token).toBe('any_token')
  })

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const loadFacebookUserApi = new LoadFacebookUserApiSpy()
    loadFacebookUserApi.result = undefined
    const sut = new FacebookAuthenticationServer(loadFacebookUserApi)
    const authResult = await sut.perform({ accessToken: 'any_token' })
    expect(authResult).toEqual(new AuthenticationError())
  })

})