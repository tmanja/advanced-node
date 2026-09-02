import { LoadFacebookUserApi } from '@/data/contacts/apis'
import { CreateFacebokAccountRepository, LoadUserAccountRepository } from '@/data/contacts/repositories/user-account'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'
import { mock, MockProxy } from 'jest-mock-extended'

describe('FacebookAuthenticationService', () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>
  let userAccountRepository: MockProxy<LoadUserAccountRepository & CreateFacebokAccountRepository>
  let sut: FacebookAuthenticationService
  const accessToken = 'any_token'

  beforeEach(() => {
    facebookApi = mock()
    facebookApi.loadUser.mockResolvedValue({
      name: 'any_facebook_name',
      email: 'any_facebook_email@mail.com',
      facebookId: 'any_facebook_id'
    })
    userAccountRepository = mock()
    sut = new FacebookAuthenticationService(
      facebookApi,
      userAccountRepository
    )
  })

  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ accessToken: 'any_token' })
    expect(facebookApi.loadUser).toHaveBeenCalledWith({ accessToken })
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadFacebookUserApi returns null', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(null)
    const authResult = await sut.perform({ accessToken })
    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should call LoadUserAccountRepository when LoadFacebookUserApi returns data', async () => {
    await sut.perform({ accessToken })
    expect(userAccountRepository.load).toHaveBeenCalledWith({ email: 'any_facebook_email@mail.com' })
    expect(userAccountRepository.load).toHaveBeenCalledTimes(1)
  })

  it('should call CreateUserAccountRepository when LoadUserAccountRepository returns null', async () => {
    userAccountRepository.load.mockResolvedValueOnce(null)
    await sut.perform({ accessToken })
    expect(userAccountRepository.createFromFacebook).toHaveBeenCalledWith({
      name: 'any_facebook_name',
      email: 'any_facebook_email@mail.com',
      facebookId: 'any_facebook_id'
    })
    expect(userAccountRepository.createFromFacebook).toHaveBeenCalledTimes(1)
  })
})