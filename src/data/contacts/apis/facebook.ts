export interface LoadFacebookUserApi {
  loadUser: (params: LoadFacebookUserApi.Params) => Promise<LoadFacebookUserApi.Result>
}

export namespace LoadFacebookUserApi {
  export type Params = {
    accessToken: string
  }

  export type Result = null | {
    name: string,
    email: string,
    facebookId: string
  }
}