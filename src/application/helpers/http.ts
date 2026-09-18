import { UnauthorizedError } from '@/application/errors'

export type HttpResponse = {
  statusCode: number,
  data: any
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
