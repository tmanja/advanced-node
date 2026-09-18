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

