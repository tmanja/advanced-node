export interface TokenGenerator {
  generateToken: (params: TokenGenerator.Input) => TokenGenerator.Output
}

export namespace TokenGenerator {
  export type Input = {
    key: string,
    expirationInMs: number
  }

  export type Output = string
}

export interface TokenValidator {
  validateToken: (params: TokenValidator.Input) => TokenValidator.Output
}

export namespace TokenValidator {
  export type Input = { token : string }
  export type Output = string
}