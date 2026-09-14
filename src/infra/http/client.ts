export interface HttpGetClient {
  get: (params: HttpGetClient.params) => Promise<HttpGetClient.Result>
}

export namespace HttpGetClient {
  export type params = {
    url: string,
    params: object
  }

  export type Result = any
}
