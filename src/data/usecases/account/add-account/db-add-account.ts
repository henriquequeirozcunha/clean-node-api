import { AddAccount } from '@/domain/usecases/account/add-account'
import { Hasher } from '@/data/protocols/criptography/hasher'
import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository'

export class DbAddAccount implements AddAccount {
  constructor (private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository) { }

  async add (accountData: AddAccount.Params): Promise<AddAccount.Result> {
    const accountLoaded = await this.loadAccountByEmailRepository.loadByEmail(accountData.email)
    let isValid = false
    if (!accountLoaded) {
      const hashedPassword = await this.hasher.hash(accountData.password)
      isValid = await this.addAccountRepository.add({ ...accountData, password: hashedPassword })
    }
    return isValid
  }
}
