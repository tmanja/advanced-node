import { LoadFacebookUserApi } from '@/data/contacts/apis'
import { LoadUserAccountRepository } from '@/data/contacts/repositories/user-account'
import { FacebookAuthenticationServer } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'
import { mock, MockProxy } from 'jest-mock-extended'

describe('FacebookAuthenticationService', () => {
  let loadFacebookUserApiMock: MockProxy<LoadFacebookUserApi>
  let loadUserAccountRepository: MockProxy<LoadUserAccountRepository>
  let sut: FacebookAuthenticationServer
  const accessToken = 'any_token'

  beforeEach(() => {
    loadFacebookUserApiMock = mock()
    loadFacebookUserApiMock.loadUser.mockResolvedValue({
      name: 'any_facebook_name',
      email: 'any_facebook_email@mail.com',
      facebookId: 'any_facebook_id'
    })
    loadUserAccountRepository = mock()
    sut = new FacebookAuthenticationServer(
      loadFacebookUserApiMock,
      loadUserAccountRepository
    )
  })

  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ accessToken: 'any_token' })
    expect(loadFacebookUserApiMock.loadUser).toHaveBeenCalledWith({ accessToken })
  })

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    loadFacebookUserApiMock.loadUser.mockResolvedValueOnce(undefined)
    const authResult = await sut.perform({ accessToken })
    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should call LoadFacebookUserApi only once', async () => {
    await sut.perform({ accessToken })
    expect(loadFacebookUserApiMock.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should call LoadUserAccountRepository with correct email when LoadFacebookUserApi returns data', async () => {
    await sut.perform({ accessToken })
    expect(loadUserAccountRepository.load).toHaveBeenCalledWith({ email: 'any_facebook_email@mail.com' })
  })
})