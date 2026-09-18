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
  let accessToken: string

  beforeAll(() => {
    accessToken = 'any_token'
    facebookApi = mock()
    facebookApi.loadUser.mockResolvedValue({
      name: 'any_facebook_name',
      email: 'any_facebook_email@mail.com',
      facebookId: 'any_facebook_id'
    })
    userAccountRepository = mock()
    userAccountRepository.load.mockResolvedValue(undefined)
    userAccountRepository.saveWithFacebook.mockResolvedValue(({ id: 'any_account_id' }))
    crypto = mock()
    crypto.generateToken.mockReturnValue('any_generated_token')
  })

  beforeEach(() => {
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
    const FacebooAccountStub = jest.fn().mockImplementationOnce(() => {
      return { any_prop: 'any_value' }
    })
    jest.mocked(FacebooAccount).mockImplementationOnce(FacebooAccountStub)

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

  it('should return an AccessToken on success', async () => {
    const authResult = await sut.perform({ accessToken })

    expect(authResult).toEqual(new AccessToken('any_generated_token'))
  })

  it('should rethrow if LoadFacebookUserApi throws', async () => {
    facebookApi.loadUser.mockRejectedValueOnce(new Error('facebook_error'))

    const authResultPromise = sut.perform({ accessToken })

    await expect(authResultPromise).rejects.toThrow(new Error('facebook_error'))
  })

  it('should rethrow if LoadUserAccountRepository throws', async () => {
    userAccountRepository.load.mockRejectedValueOnce(new Error('load_error'))

    const authResultPromise = sut.perform({ accessToken })

    await expect(authResultPromise).rejects.toThrow(new Error('load_error'))
  })

  it('should rethrow if SaveFacebookAccountRepository throws', async () => {
    userAccountRepository.saveWithFacebook.mockRejectedValueOnce(new Error('save_error'))

    const authResultPromise = sut.perform({ accessToken })

    await expect(authResultPromise).rejects.toThrow(new Error('save_error'))
  })

  it('should rethrow if TokenGenerator throws', async () => {
    crypto.generateToken.mockImplementationOnce(() => {
      throw new Error('token_error')
    })

    const authResultPromise = sut.perform({ accessToken })

    expect(authResultPromise).rejects.toThrow(new Error('token_error'))
  })
})