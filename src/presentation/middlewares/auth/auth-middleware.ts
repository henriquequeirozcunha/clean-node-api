import { Middleware } from '@/presentation/protocols/middleware'
import { LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token'
import { HttpResponse } from '@/presentation/protocols'
import { forbidden, serverError, ok } from '@/presentation/helpers/http/http-helper'
import { AccessDeniedError } from '@/presentation/erros'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) {}

  async handle (request: AuthMiddleware.Request): Promise<HttpResponse> {
    try {
      const { accessToken } = request
      if (accessToken) {
        const account = await this.loadAccountByToken.load(accessToken, this.role)

        if (account) {
          return ok({ accountId: account.id })
        }
      }
      return forbidden(new AccessDeniedError())
    } catch (error) {
      return serverError(error)
    }
  };
}

export namespace AuthMiddleware {
  export type Request = {
    accessToken?: string
  }
}
