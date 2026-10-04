import { RequestHandler, Request, Response, NextFunction } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { HttpResponse } from '@/application/helpers'
import { mock, MockProxy } from 'jest-mock-extended'

type MiddlewareAdapter = (middleware: Middleware) => RequestHandler

const adaptExpressMiddleware: MiddlewareAdapter = middleware => (req, res, next) => {
  middleware.handle({...req.headers})
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
    })

    beforeEach(() => {
      sut = adaptExpressMiddleware(middleware)
    })

  it('should call handle with correct request', () => {
    sut(req, res, next)

    expect(middleware.handle).toHaveBeenCalledWith({ any: 'any' })
    expect(middleware.handle).toHaveBeenCalledTimes(1)
  })

  it('should call handle with empty request', () => {
    req = getMockReq()

    sut(req, res, next)

    expect(middleware.handle).toHaveBeenCalledWith({})
    expect(middleware.handle).toHaveBeenCalledTimes(1)
  })
})