export interface LoadUserAccountRepository {
  load: (params: LoadUserAccountRepository.Params) => Promise<LoadUserAccountRepository.Result>
}

export namespace LoadUserAccountRepository {
  export type Params = {
    email: string
  }

  export type Result = null | {
    id: string,
    name?: string,
  }
}

export interface SaveFacebookAccountRepository {
  saveWithFacebook: (params: SaveFacebokAccountRepository.Params) => Promise<void>
}

export namespace SaveFacebokAccountRepository {
  export type Params = {
    id?: string | undefined
    name: string,
    email: string,
    facebookId: string
  }
}
