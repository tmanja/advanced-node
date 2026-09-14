export interface HttpGetClient {
  get: (params: HttpGetClient.params) => Promise<void>
}

export namespace HttpGetClient {
  export type params = {
    url: string,
    params: object
  }
}