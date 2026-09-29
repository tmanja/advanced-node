import { ForbiddenError } from '@/application/errors'
import { forbidden, HttpResponse } from '@/application/helpers'

type HttpRequest = { authorization: string }

class AuthenticationMiddleware {
  handle (httpRequest: HttpRequest): HttpResponse<Error> {
    return forbidden()
  }
}

describe('AuthenticationMiddleware', () => {
  it('should return 403 if authorization is empty', () => {
    const sut = new AuthenticationMiddleware()

    const httpResponse = sut.handle({ authorization: '' })

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })

  it('should return 403 if authorization is null', () => {
    const sut = new AuthenticationMiddleware()

    const httpResponse = sut.handle({ authorization: null as any })

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })

  it('should return 403 if authorization is undefined', () => {
    const sut = new AuthenticationMiddleware()

    const httpResponse = sut.handle({ authorization: undefined as any })

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })
})