import { AccountModel } from '../models/account'
import { AddAccount } from '@/domain/usecases/account/add-account'
import { Authentication } from '@/domain/usecases/account/authentication'
import { LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token'

export const mockAddAccountParams = (): AddAccount.Params => ({
  name: 'any_name',
  email: 'any_email@email.com',
  password: 'any_password'
})

export const mockAccountModel = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@email.com',
  password: 'any_password'
})

export const mockAuthentication = (): Authentication.Params => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

export const mockLoadAccountByToken = (): LoadAccountByToken.Params => ({
  accessToken: 'any_token',
  role: 'any_role'
})
