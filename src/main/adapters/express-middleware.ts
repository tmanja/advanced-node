import { Middleware } from '@/application/middlewares'
import { RequestHandler } from 'express'

type MiddlewareAdapter = (middleware: Middleware) => RequestHandler

export const adaptExpressMiddleware: MiddlewareAdapter = middleware => (req, res, next) => {
  const { statusCode, data } = middleware.handle({...req.headers})
  if (statusCode === 200) {
    req.locals = {...req.locals, ...data}
    next()
  } else {
    const error = data
    res.status(statusCode).json({ error: error.message })
  }
}