export interface LoadUserAccount {
  load: (params: LoadUserAccount.Input) => Promise<LoadUserAccount.Output>
}

export namespace LoadUserAccount {
  export type Input = {
    email: string
  }

  export type Output = undefined | {
    id: string,
    name?: string,
  }
}

export interface SaveFacebookAccount {
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
