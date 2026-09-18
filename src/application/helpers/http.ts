import { ServerError, UnauthorizedError } from '@/application/errors'

export type HttpResponse = {
  statusCode: number,
  data: any
}

export function ok (data: any): HttpResponse {
  return {
    statusCode: 200,
    data
  }
}

export function badRequest (error: Error): HttpResponse {
  return {
    statusCode: 400,
    data: error
  }
}

export function unauthorized (): HttpResponse {
  return {
    statusCode: 401,
    data: new UnauthorizedError()
  }
}

export function serverError (error: Error): HttpResponse {
  return {
    statusCode: 500,
    data: new ServerError(error)
  }
}
