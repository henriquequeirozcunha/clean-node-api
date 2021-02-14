import { LoadAccountByToken } from './../../../domain/usecases/load-account-by-token'
import { AccessDeniedError } from './../../erros/access-denied-error'
import { forbidden, ok } from './../../helpers/http/http-helper'
import { Middleware } from './../../protocols/middleware'
import { HttpRequest, HttpResponse } from '../../protocols'
export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.['x-access-token']
    if (accessToken) {
      const account = await this.loadAccountByToken.load(accessToken)

      if (account) {
        return ok({ accountId: account.id })
      }
    }
    return forbidden(new AccessDeniedError())
  };
}
