import { LoadFacebookUserApi } from '@/domain/contracts/apis'
import {  LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/domain/contracts/repositories/user-account'
import { FacebookAuthentication, setupFacebookAuthentication } from '@/domain/use-cases'
import { AuthenticationError } from '@/domain/entities/errors'
import { mock, MockProxy } from 'jest-mock-extended'
import { AccessToken, FacebookAccount } from '@/domain/entities'
import { TokenGenerator } from '@/domain/contracts/crypto'

jest.mock('@/domain/entities/facebook-account')

describe('FacebookAuthentication', () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>
  let crypto: MockProxy<TokenGenerator>
  let userAccountRepository: MockProxy<
    LoadUserAccountRepository &
    SaveFacebookAccountRepository
    >
  let sut: FacebookAuthentication
  let token: string

  beforeAll(() => {
    token = 'any_token'
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
    sut = setupFacebookAuthentication(
      facebookApi,
      userAccountRepository,
      crypto
    )
  })

  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut({ token })

    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token })
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadFacebookUserApi returns null', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(null)

    const authResult = await sut({ token })

    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should call LoadUserAccountRepository when LoadFacebookUserApi returns data', async () => {
    await sut({ token: token })

    expect(userAccountRepository.load).toHaveBeenCalledWith({ email: 'any_facebook_email@mail.com' })
    expect(userAccountRepository.load).toHaveBeenCalledTimes(1)
  })

  it('should call SaveFacebookAccountRepository with FacebookAccount', async () => {
    jest.mocked(FacebookAccount).mockImplementationOnce(() => ({
      name: 'any_name',
      email: 'any_email@mail.com',
      facebookId: 'any_facebook_id'
    }))

    await sut({ token: token })

    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      facebookId: 'any_facebook_id'
    })
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  it('should call TokenGenerator with correct parmams', async () => {
    await sut({ token: token })

    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMs: AccessToken.expirationInMs
    })
    expect(crypto.generateToken).toHaveBeenCalledTimes(1)
  })

  it('should return an AccessToken on success', async () => {
    const authResult = await sut({ token })

    expect(authResult).toEqual(new AccessToken('any_generated_token'))
  })

  it('should rethrow if LoadFacebookUserApi throws', async () => {
    facebookApi.loadUser.mockRejectedValueOnce(new Error('facebook_error'))

    const authResultPromise = sut({ token })

    await expect(authResultPromise).rejects.toThrow(new Error('facebook_error'))
  })

  it('should rethrow if LoadUserAccountRepository throws', async () => {
    userAccountRepository.load.mockRejectedValueOnce(new Error('load_error'))

    const authResultPromise = sut({ token })

    await expect(authResultPromise).rejects.toThrow(new Error('load_error'))
  })

  it('should rethrow if SaveFacebookAccountRepository throws', async () => {
    userAccountRepository.saveWithFacebook.mockRejectedValueOnce(new Error('save_error'))

    const authResultPromise = sut({ token: token })

    await expect(authResultPromise).rejects.toThrow(new Error('save_error'))
  })

  it('should rethrow if TokenGenerator throws', async () => {
    crypto.generateToken.mockImplementationOnce(() => {
      throw new Error('token_error')
    })

    const authResultPromise = sut({ token })

    expect(authResultPromise).rejects.toThrow(new Error('token_error'))
  })
})