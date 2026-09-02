export interface LoadUserAccountRepository {
  load: (params: LoadUserAccountRepository.Params) => Promise<LoadUserAccountRepository.Result>
}

export namespace LoadUserAccountRepository {
  export type Params = {
    email: string
  }

  export type Result = null
}

export interface CreateFacebokAccountRepository {
  createFromFacebook: (params: CreateFacebokAccountRepository.Params) => Promise<void>
}

export namespace CreateFacebokAccountRepository {
  export type Params = {
    name: string,
    email: string,
    facebookId: string
  }
}