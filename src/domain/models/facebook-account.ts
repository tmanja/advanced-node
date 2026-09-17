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
  id?: string
  name: string
  email: string
  facebookId: string

  constructor (facebookAccount: FacebookAccount, userAccount?: UserAccount) {
    if (userAccount?.id) {
      this.id = userAccount.id
    }
    this.name = userAccount?.name ?? facebookAccount.name
    this.email = facebookAccount.email
    this.facebookId = facebookAccount.facebookId
  }
}