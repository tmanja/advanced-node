import { FacebookLoginController } from '@/application/controllers'
import {  UnauthorizedError } from '@/application/errors'
import { RequiredStringValidator } from '@/application/validation'
import { AuthenticationError } from '@/domain/entities/errors'
import { AccessToken } from '@/domain/entities'


describe('FacebookLoginController', () => {
  let sut: FacebookLoginController
  let facebookAutheneticationMock: jest.Mock
  let token: string

  beforeAll(() => {
    facebookAutheneticationMock = jest.fn()
    facebookAutheneticationMock.mockResolvedValue({ accessToken: 'any_token'})
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

    expect(facebookAutheneticationMock).toHaveBeenCalledWith({ token })
    expect(facebookAutheneticationMock).toHaveBeenCalledTimes(1)
  })

  it('should return 401 if authentication fails', async () => {
    facebookAutheneticationMock.mockRejectedValueOnce(new AuthenticationError())

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
        accessToken: 'any_token'
      }
    })
  })

})