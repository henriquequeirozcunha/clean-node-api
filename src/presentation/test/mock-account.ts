import { AddAccount } from '@/domain/usecases/account/add-account'
import { AccountModel } from '@/domain/models/account'
import { mockAccountModel } from '@/domain/test'
import { Authentication } from '@/domain/usecases/account/authentication'
import { LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token'
import { mockAuthenticationModel } from '@/domain/test/mock-authentication'

export const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccount.Params): Promise<AddAccount.Result> {
      return await Promise.resolve(true)
    }
  }
  return new AddAccountStub()
}

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: Authentication.Params): Promise<Authentication.Result> {
      return await Promise.resolve(mockAuthenticationModel())
    }
  }
  return new AuthenticationStub()
}

export const mockLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (accessToken: String, role?: String): Promise<AccountModel> {
      return await Promise.resolve(mockAccountModel())
    }
  }

  return new LoadAccountByTokenStub()
}
