import { ServerError, ForbiddenError } from '@/application/errors'

export type HttpResponse<T = any> = {
  statusCode: number,
  data: T
}

export function ok<T = any> (data: T): HttpResponse<T> {
  return {
    statusCode: 200,
    data
  }
}

export function badRequest (error: Error): HttpResponse<Error> {
  return {
    statusCode: 400,
    data: error
  }
}

export function unauthorized (): HttpResponse<Error> {
  return {
    statusCode: 401,
    data: new ForbiddenError()
  }
}

export function forbidden (): HttpResponse<Error> {
  return {
    statusCode: 403,
    data: new ForbiddenError()
  }
}

export function serverError (error: Error): HttpResponse<Error> {
  return {
    statusCode: 500,
    data: new ServerError(error)
  }
}

