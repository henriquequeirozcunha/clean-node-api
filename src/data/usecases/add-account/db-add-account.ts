import { AddAccountRepository } from '../../protocols/db/account/add-account-repository'
import { AccountModel } from '../../../domain/models/account'
import { AddAccount, AddAccountModel } from '../../../domain/usecases/add-account'
import { Hasher } from '../../protocols/criptography/hasher'
export class DbAddAccount implements AddAccount {
  constructor (private readonly hasher: Hasher, private readonly addAccountRepository: AddAccountRepository) { }

  async add (account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(account.password)
    const newAccount = await this.addAccountRepository.add(Object.assign({},account, { password: hashedPassword }))
    return newAccount
  }
}
