import { ForbiddenError } from '@/application/errors'
import { forbidden, HttpResponse } from '@/application/helpers'

type HttpRequest = { authorization: string }

class AuthenticationMiddleware {
  handle (httpRequest: HttpRequest): HttpResponse<Error> {
    return forbidden()
  }
}

describe('AuthenticationMiddleware', () => {
  let sut: AuthenticationMiddleware

  beforeEach(() => {
    sut = new AuthenticationMiddleware()
  })

  it('should return 403 if authorization is empty', () => {
    const httpResponse = sut.handle({ authorization: '' })

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })

  it('should return 403 if authorization is null', () => {
    const httpResponse = sut.handle({ authorization: null as any })

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })

  it('should return 403 if authorization is undefined', () => {
    const httpResponse = sut.handle({ authorization: undefined as any })

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })
})