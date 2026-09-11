import { LoadFacebookUserApi } from '@/data/contacts/apis'
import {  LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contacts/repositories/user-account'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'
import { mock, MockProxy } from 'jest-mock-extended'
import { AccessToken, FacebooAccount } from '@/domain/models'
import { TokenGenerator } from '@/data/contacts/crypto'

jest.mock('@/domain/models/facebook-account')

describe('FacebookAuthenticationService', () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>
  let crypto: MockProxy<TokenGenerator>
  let userAccountRepository: MockProxy<
    LoadUserAccountRepository &
    SaveFacebookAccountRepository
    >
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
    userAccountRepository.load.mockResolvedValue(null)
    userAccountRepository.saveWithFacebook.mockResolvedValue(({ id: 'any_account_id' }))
    crypto = mock()
    sut = new FacebookAuthenticationService(
      facebookApi,
      userAccountRepository,
      crypto
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

  it('should call SaveFacebookAccountRepository with FacebookAccount', async () => {
    const FacebooAccountStub = jest.fn().mockImplementation(() => {
      return { any_prop: 'any_value' }
    })
    jest.mocked(FacebooAccount).mockImplementation(FacebooAccountStub)
    await sut.perform({ accessToken })
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith({ any_prop: 'any_value' })
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  it('should call TokenGenerator with correct parmams', async () => {
    await sut.perform({ accessToken })
    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMs: AccessToken.expirationInMs
    })
    expect(crypto.generateToken).toHaveBeenCalledTimes(1)
  })
})