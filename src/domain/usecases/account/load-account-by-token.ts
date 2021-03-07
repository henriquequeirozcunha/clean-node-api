import { AccountModel } from '@/domain/models/account'
export interface LoadAccountByToken {
  load: (accessToken: string, role?: String) => Promise<AccountModel>
}
