import { AddAccount, AddAccountParams } from '@/domain/usecases/account/add-account'
import { Hasher } from '@/data/protocols/criptography/hasher'
import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository'
import { AccountModel } from '@/domain/models/account'

export class DbAddAccount implements AddAccount {
  constructor (private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository) { }

  async add (accountData: AddAccountParams): Promise<AccountModel> {
    const accountLoaded = await this.loadAccountByEmailRepository.loadByEmail(accountData.email)
    if (accountLoaded) {
      return null
    }
    const hashedPassword = await this.hasher.hash(accountData.password)
    const newAccount = await this.addAccountRepository.add(Object.assign({},accountData, { password: hashedPassword }))
    return newAccount
  }
}
