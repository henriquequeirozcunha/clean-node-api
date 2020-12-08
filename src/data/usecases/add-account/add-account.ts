import { AddAccountRepository } from './../../protocols/add-account-repository'
import { AccountModel } from './../../../domain/models/account'
import { AddAccount, AddAccountModel } from './../../../domain/usecases/add-account'
import { Encrypter } from '../../protocols/encrypter'
export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly addAccountRepository: AddAccountRepository
  constructor (encrypter: Encrypter, addAccountRepository: AddAccountRepository) {
    this.encrypter = encrypter
    this.addAccountRepository = addAccountRepository
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(account.password)
    const newAccount = await this.addAccountRepository.add(Object.assign({},account, { password: hashedPassword }))
    return newAccount
  }
}
