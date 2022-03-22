import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { FacebookAuthenticationService } from '@/data/services/facebook-authentication'
import { AuthenticationError } from '@/domain/errors'

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: LoadFacebookUserApi.Params
  result: undefined
  async loadUser (params: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
    this.token = { token: params.token }
    return this.result
  }
}

describe('FacebookAuthenticationService', () => {
  it('should call LoadFacebookUserApi with correct value', async () => {
    const loadFacebookUserApi = new LoadFacebookUserApiSpy()
    const sut = new FacebookAuthenticationService(loadFacebookUserApi)
    await sut.perform({ token: 'any_token' })
    expect(loadFacebookUserApi.token).toEqual({ token: 'any_token' })
  })
  it('should return AuthenticationError when LoadFacebookUserApi returns undefined',
    async () => {
      const loadFacebookUserApi = new LoadFacebookUserApiSpy()
      loadFacebookUserApi.result = undefined
      const sut = new FacebookAuthenticationService(loadFacebookUserApi)
      const authResult = await sut.perform({ token: 'any_token' })
      expect(authResult).toEqual(new AuthenticationError())
    })
})
