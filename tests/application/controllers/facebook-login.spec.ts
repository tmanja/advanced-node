import { FacebookLoginController } from '@/application/controllers'
import {  UnauthorizedError } from '@/application/errors'
import { RequiredStringValidator } from '@/application/validation'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { AccessToken } from '@/domain/models'
import { mock, MockProxy } from 'jest-mock-extended'


describe('FacebookLoginController', () => {
  let sut: FacebookLoginController
  let facebookAutheneticationMock: MockProxy<FacebookAuthentication>
  let token: string

  beforeAll(() => {
    facebookAutheneticationMock = mock()
    facebookAutheneticationMock.perform.mockResolvedValue(new AccessToken('any_value'))
    token = 'any_token'
  })

  beforeEach(() => {
    sut = new FacebookLoginController(facebookAutheneticationMock)
  })

  it('should build Validators correctly', async () => {
    const validators = sut.buildValidators({ token })

    expect(validators).toEqual([
      new RequiredStringValidator('any_token', 'token')
    ])
  })

  it('should call FacebookAuthentication with correct param', async () => {
    await sut.handle({ token })

    expect(facebookAutheneticationMock.perform).toHaveBeenCalledWith({ token })
    expect(facebookAutheneticationMock.perform).toHaveBeenCalledTimes(1)
  })

  it('should return 401 if authentication fails', async () => {
    facebookAutheneticationMock.perform.mockResolvedValueOnce(new AuthenticationError())

    const httpResponse = await sut.handle({ token })

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new UnauthorizedError()
    })
  })

  it('should return 200 if authentication succeeds', async () => {
    const httpResponse = await sut.handle({ token })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        accessToken: 'any_value'
      }
    })
  })

})