import { RequestHandler, Request, Response, NextFunction } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { mock, MockProxy } from 'jest-mock-extended'
import { adaptExpressMiddleware } from '@/main/adapters/express-middleware'
import { Middleware } from '@/application/middlewares'

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
      statusCode: 200,
      data: { data: 'any_data' }
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
    middleware.handle.mockReturnValueOnce({
      statusCode: 500,
      data: new Error('any_error')
    })

    sut(req, res, next)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({ error: 'any_error' })
    expect(res.json).toHaveBeenCalledTimes(1)
  })

  it('should add data to req.locals', () => {
    sut(req, res, next)

    expect(req.locals).toEqual({ data: 'any_data' })
    expect(next).toHaveBeenCalled()
    expect(next).toHaveBeenCalledTimes(1)
  })
})