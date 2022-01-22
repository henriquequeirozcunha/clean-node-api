import { LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token'

export interface LoadAccountByTokenRepository {
  loadByToken: (data: LoadAccountByToken.Params) => Promise<LoadAccountByTokenRepository.Result>
}

export namespace LoadAccountByTokenRepository {
  export type Params = LoadAccountByToken.Params
  export type Result = LoadAccountByToken.Result
}
