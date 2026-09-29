export interface LoadUserAccountRepository {
  load: (params: LoadUserAccountRepository.Input) => Promise<LoadUserAccountRepository.Output>
}

export namespace LoadUserAccountRepository {
  export type Input = {
    email: string
  }

  export type Output = undefined | {
    id: string,
    name?: string,
  }
}

export interface SaveFacebookAccountRepository {
  saveWithFacebook: (params: SaveFacebokAccountRepository.Input) => Promise<SaveFacebokAccountRepository.Output>
}

export namespace SaveFacebokAccountRepository {
  export type Input = {
    id?: string,
    name: string,
    email: string,
    facebookId: string
  }

  export type Output ={
    id: string
  }
}
