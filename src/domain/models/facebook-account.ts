type FacebookAccount = {
  name: string,
  email: string,
  facebookId: string
}

type UserAccount = null | {
  id?: string,
  name?: string
}

export class FacebooAccount {
  id?: string | undefined
  name: string
  email: string
  facebookId: string

  constructor (facebookAccount: FacebookAccount, userAccount?: UserAccount) {
    this.id = userAccount?.id ?? undefined
    this.name = userAccount?.name ?? facebookAccount.name
    this.email = facebookAccount.email
    this.facebookId = facebookAccount.facebookId
  }
}