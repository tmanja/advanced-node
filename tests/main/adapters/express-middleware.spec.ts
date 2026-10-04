import { RequestHandler, Request, Response, NextFunction } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { HttpResponse } from '@/application/helpers'
import { mock, MockProxy } from 'jest-mock-extended'

type MiddlewareAdapter = (middleware: Middleware) => RequestHandler

const adaptExpressMiddleware: MiddlewareAdapter = middleware => (req, res, next) => {
  const { statusCode, data } = middleware.handle({...req.headers})
  res.status(statusCode).json({ error: data.message })
}

interface Middleware {
  handle: (httpRequest: any) => HttpResponse
}

describe('ExpressMiddleware', () => {
  let req: Request
  let res: Response
  let next: NextFunction
  let middleware: MockProxy<Middleware>
  let sut: RequestHandler

  beforeAll(() => {
    req = getMockReq({ headers: { any: 'any' }})
    res = getMockRes().res
    next = getMockRes().next
    middleware = mock()
    middleware.handle.mockReturnValue({
      statusCode: 500,
      data: new Error('any_error')
    })
  })

    beforeEach(() => {
      sut = adaptExpressMiddleware(middleware)
    })

  it('should call handle with correct request', () => {
    sut(req, res, next)

    expect(middleware.handle).toHaveBeenCalledWith({ any: 'any' })
    expect(middleware.handle).toHaveBeenCalledTimes(1)
  })

  it('should respond with correct error and status code', () => {
    sut(req, res, next)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({ error: 'any_error' })
    expect(res.json).toHaveBeenCalledTimes(1)
  })
})