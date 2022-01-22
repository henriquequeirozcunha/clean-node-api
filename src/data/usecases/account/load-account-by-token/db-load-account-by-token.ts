import { LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token'
import { Decrypter } from '@/data/protocols/criptography/decrypter'
import { LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load (data: LoadAccountByToken.Params): Promise<LoadAccountByToken.Result> {
    const { accessToken, role } = data
    let token: string
    try {
      token = await this.decrypter.decrypt(accessToken)
    } catch (error) {
      return null
    }
    if (token) {
      const account = await this.loadAccountByTokenRepository.loadByToken({ accessToken, role })
      if (account) {
        return {
          id: account.id
        }
      }
    }
    return null
  }
}
