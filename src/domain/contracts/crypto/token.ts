export interface TokenGenerator {
  generateToken: (params: TokenGenerator.Params) => TokenGenerator.Result
}

export namespace TokenGenerator {
  export type Params = {
    key: string,
    expirationInMs: number
  }

  export type Result = string
}

export interface TokenValidator {
  validateToken: (params: TokenValidator.Params) => TokenValidator.Result
}

export namespace TokenValidator {
  export type Params = { token : string }
  export type Result = string
}