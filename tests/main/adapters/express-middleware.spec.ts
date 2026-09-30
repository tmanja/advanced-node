import { RequestHandler } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { HttpResponse } from '@/application/helpers'
import { mock } from 'jest-mock-extended'

type MiddlewareAdapter = (middleware: Middleware) => RequestHandler

const adaptExpressMiddleware: MiddlewareAdapter = middleware => (req, res, next) => {
  middleware.handle({...req.headers})
}

interface Middleware {
  handle: (httpRequest: any) => HttpResponse
}

describe('ExpressMiddleware', () => {
  it('should call handle with correct request', () => {
    const req = getMockReq({ headers: { any: 'any' }})
    const res = getMockRes().res
    const next = getMockRes().next
    const middleware = mock<Middleware>()
    const sut = adaptExpressMiddleware(middleware)

    sut(req, res, next)

    expect(middleware.handle).toHaveBeenCalledWith({ any: 'any' })
    expect(middleware.handle).toHaveBeenCalledTimes(1)
  })

  it('should call handle with empty request', () => {
    const req = getMockReq()
    const res = getMockRes().res
    const next = getMockRes().next
    const middleware = mock<Middleware>()
    const sut = adaptExpressMiddleware(middleware)

    sut(req, res, next)

    expect(middleware.handle).toHaveBeenCalledWith({})
    expect(middleware.handle).toHaveBeenCalledTimes(1)
  })
})