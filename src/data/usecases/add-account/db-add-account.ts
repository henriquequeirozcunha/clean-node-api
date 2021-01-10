import { AddAccountRepository } from '../../protocols/db/account/add-account-repository'
import { AccountModel } from '../../../domain/models/account'
import { AddAccount, AddAccountModel } from '../../../domain/usecases/add-account'
import { Hasher } from '../../protocols/criptography/hasher'
import { LoadAccountByEmailRepository } from '../../protocols/db/account/load-account-by-email-repository'
export class DbAddAccount implements AddAccount {
  constructor (private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository) { }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountLoaded = await this.loadAccountByEmailRepository.loadByEmail(accountData.email)
    if (accountLoaded) {
      return null
    }
    const hashedPassword = await this.hasher.hash(accountData.password)
    const newAccount = await this.addAccountRepository.add(Object.assign({},accountData, { password: hashedPassword }))
    return newAccount
  }
}
