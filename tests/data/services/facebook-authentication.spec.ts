import { FacebookAuthenticationServer } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'

describe('FacebookAuthenticationService', () => {
  it('should call LoadFacebookUserApi with correct params', async () => {
    const loadFacebookUserApiSpy = {
      loadUser: jest.fn()
    }
    const sut = new FacebookAuthenticationServer(loadFacebookUserApiSpy)
    await sut.perform({ accessToken: 'any_token' })
    expect(loadFacebookUserApiSpy.loadUser).toHaveBeenCalledWith({ accessToken: 'any_token' })
  })

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const loadFacebookUserApiSpy = {
      loadUser: jest.fn()
    }
    loadFacebookUserApiSpy.loadUser.mockResolvedValueOnce(undefined)
    const sut = new FacebookAuthenticationServer(loadFacebookUserApiSpy)
    const authResult = await sut.perform({ accessToken: 'any_token' })
    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should call LoadFacebookUserApi only once', async () => {
    const loadFacebookUserApiSpy = {
      loadUser: jest.fn()
    }
    const sut = new FacebookAuthenticationServer(loadFacebookUserApiSpy)
    await sut.perform({ accessToken: 'any_token' })
    expect(loadFacebookUserApiSpy.loadUser).toHaveBeenCalledTimes(1)
  })
})