export interface HttpGetClient {
  get: <T = any> (params: HttpGetClient.params) => Promise<T>
}

export namespace HttpGetClient {
  export type params = {
    url: string,
    params: object
  }
}
