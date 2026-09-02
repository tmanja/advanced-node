import { LoadFacebookUserApi } from '@/data/contacts/apis'
import { CreateFacebokAccountRepository, LoadUserAccountRepository } from '@/data/contacts/repositories/user-account'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'
import { mock, MockProxy } from 'jest-mock-extended'

describe('FacebookAuthenticationService', () => {
  let loadFacebookUserApiMock: MockProxy<LoadFacebookUserApi>
  let loadUserAccountRepositoryMock: MockProxy<LoadUserAccountRepository>
  let createFacebookAccountRepositoryMock: MockProxy<CreateFacebokAccountRepository>
  let sut: FacebookAuthenticationService
  const accessToken = 'any_token'

  beforeEach(() => {
    loadFacebookUserApiMock = mock()
    loadFacebookUserApiMock.loadUser.mockResolvedValue({
      name: 'any_facebook_name',
      email: 'any_facebook_email@mail.com',
      facebookId: 'any_facebook_id'
    })
    loadUserAccountRepositoryMock = mock()
    createFacebookAccountRepositoryMock = mock()
    sut = new FacebookAuthenticationService(
      loadFacebookUserApiMock,
      loadUserAccountRepositoryMock,
      createFacebookAccountRepositoryMock
    )
  })

  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ accessToken: 'any_token' })
    expect(loadFacebookUserApiMock.loadUser).toHaveBeenCalledWith({ accessToken })
  })

  it('should return AuthenticationError when LoadFacebookUserApi returns null', async () => {
    loadFacebookUserApiMock.loadUser.mockResolvedValueOnce(null)
    const authResult = await sut.perform({ accessToken })
    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should call LoadFacebookUserApi only once', async () => {
    await sut.perform({ accessToken })
    expect(loadFacebookUserApiMock.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should call LoadUserAccountRepository with correct email when LoadFacebookUserApi returns data', async () => {
    await sut.perform({ accessToken })
    expect(loadUserAccountRepositoryMock.load).toHaveBeenCalledWith({ email: 'any_facebook_email@mail.com' })
  })

  it('should call CreateUserAccountRepository when LoadUserAccountRepository returns null', async () => {
    loadUserAccountRepositoryMock.load.mockResolvedValueOnce(null)
    await sut.perform({ accessToken })
    expect(createFacebookAccountRepositoryMock.createFromFacebook).toHaveBeenCalledWith({
      name: 'any_facebook_name',
      email: 'any_facebook_email@mail.com',
      facebookId: 'any_facebook_id'
    })
  })
})