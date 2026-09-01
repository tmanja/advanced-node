import { LoadFacebookUserApi } from '@/data/contacts/apis'
import { FacebookAuthenticationServer } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string
  result: undefined
  callsCount = 0

  async loadUser(params: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
    this.token = params.accessToken
    this.callsCount+=1
    return this.result
  }
}

describe('FacebookAuthenticationService', () => {
  it('should call LoadFacebookUserApi with correct params', async () => {
    const loadFacebookUserApiSpy = new LoadFacebookUserApiSpy()
    const sut = new FacebookAuthenticationServer(loadFacebookUserApiSpy)
    await sut.perform({ accessToken: 'any_token' })
    expect(loadFacebookUserApiSpy.token).toBe('any_token')
  })

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const loadFacebookUserApiSpy = new LoadFacebookUserApiSpy()
    loadFacebookUserApiSpy.result = undefined
    const sut = new FacebookAuthenticationServer(loadFacebookUserApiSpy)
    const authResult = await sut.perform({ accessToken: 'any_token' })
    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should call LoadFacebookUserApi only once', async () => {
    const loadFacebookUserApiSpy = new LoadFacebookUserApiSpy()
    const sut = new FacebookAuthenticationServer(loadFacebookUserApiSpy)
    await sut.perform({ accessToken: 'any_token' })
    expect(loadFacebookUserApiSpy.callsCount).toBe(1)
  })
})