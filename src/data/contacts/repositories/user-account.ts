export interface LoadUserAccountRepository {
  load: (params: LoadUserAccountRepository.Params) => Promise<LoadUserAccountRepository.Result>
}

export namespace LoadUserAccountRepository {
  export type Params = {
    email: string
  }

  export type Result = undefined | {
    id: string,
    name?: string | undefined,
  }
}

export interface SaveFacebookAccountRepository {
  saveWithFacebook: (params: SaveFacebokAccountRepository.Params) => Promise<SaveFacebokAccountRepository.Result>
}

export namespace SaveFacebokAccountRepository {
  export type Params = {
    id?: string | undefined
    name: string,
    email: string,
    facebookId: string
  }

  export type Result ={
    id: string
  }
}
