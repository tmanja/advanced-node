import { LoadFacebookUserApi } from '@/data/contacts/apis'
import { FacebookAuthenticationServer } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'
import { mock, MockProxy } from 'jest-mock-extended'

type SutTypes = {
  sut: FacebookAuthenticationServer,
  loadFacebookUserApiSpy: MockProxy<LoadFacebookUserApi>
}

function makeSut (): SutTypes {
  const loadFacebookUserApiSpy = mock<LoadFacebookUserApi>()
  const sut = new FacebookAuthenticationServer(loadFacebookUserApiSpy)
  return {
    sut,
    loadFacebookUserApiSpy
  }
}

describe('FacebookAuthenticationService', () => {
  it('should call LoadFacebookUserApi with correct params', async () => {
    const { sut, loadFacebookUserApiSpy } = makeSut()
    await sut.perform({ accessToken: 'any_token' })
    expect(loadFacebookUserApiSpy.loadUser).toHaveBeenCalledWith({ accessToken: 'any_token' })
  })

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const { sut, loadFacebookUserApiSpy } = makeSut()
    loadFacebookUserApiSpy.loadUser.mockResolvedValueOnce(undefined)
    const authResult = await sut.perform({ accessToken: 'any_token' })
    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should call LoadFacebookUserApi only once', async () => {
    const { sut, loadFacebookUserApiSpy } = makeSut()
    await sut.perform({ accessToken: 'any_token' })
    expect(loadFacebookUserApiSpy.loadUser).toHaveBeenCalledTimes(1)
  })
})