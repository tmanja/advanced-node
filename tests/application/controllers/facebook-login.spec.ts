import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { AccessToken } from '@/domain/models'
import { mock, MockProxy } from 'jest-mock-extended'

type HttpResponse = {
  statusCode: number,
  data: any
}

class FacebookLoginController {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {}

  async handle (httpRequest: any): Promise<HttpResponse> {
    if (httpRequest.token === '' || httpRequest.token === null || httpRequest.token === undefined) {
      return {
        statusCode: 400,
        data: new Error('The field token is required')
      }
    }
    const result = await this.facebookAuthentication.perform({ accessToken: httpRequest.token })
    if (result instanceof AccessToken) {
      return {
        statusCode: 200,
        data:  { accessToken: result.value }
      }
    }
    return {
      statusCode: 401,
      data: result
    }
  }
}

describe('FacebookLoginController', () => {
  let sut: FacebookLoginController
  let facebookAutheneticationMock: MockProxy<FacebookAuthentication>

  beforeAll(() => {
    facebookAutheneticationMock = mock()
    facebookAutheneticationMock.perform.mockResolvedValue(new AccessToken('any_value'))
  })

  beforeEach(() => {
    sut = new FacebookLoginController(facebookAutheneticationMock)
  })

  it('should return 400 if token is empty', async () => {
    const httpResponse = await sut.handle({ token: '' })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required')
    })
  })

  it('should return 400 if token is null', async () => {
    const httpResponse = await sut.handle({ token: null })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required')
    })
  })

  it('should return 400 if token is undefined', async () => {
    const httpResponse = await sut.handle({ token: undefined })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required')
    })
  })

  it('should call FacebookAuthentication with correct param', async () => {
    await sut.handle({ token: 'any_token' })

    expect(facebookAutheneticationMock.perform).toHaveBeenCalledWith({ accessToken: 'any_token'})
    expect(facebookAutheneticationMock.perform).toHaveBeenCalledTimes(1)
  })

  it('should return 401 if authentication fails', async () => {
    facebookAutheneticationMock.perform.mockResolvedValueOnce(new AuthenticationError())

    const httpResponse = await sut.handle({ token: 'any_token' })

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new AuthenticationError()
    })
  })

  it('should return 200 if authentication succeeds', async () => {
    const httpResponse = await sut.handle({ token: 'any_token' })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        accessToken: 'any_value'
      }
    })
  })

})