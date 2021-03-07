import { Controller, Validation, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { AddAccount } from '@/domain/usecases/account/add-account'
import { Authentication } from '@/domain/usecases/account/authentication'
import { badRequest, forbidden, serverError, ok } from '@/presentation/helpers/http/http-helper'
import { EmailInUseError } from '@/presentation/erros'

export class SignUpController implements Controller {
  constructor (private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { password, email, name } = httpRequest.body
      const account = await this.addAccount.add({
        name,
        email,
        password
      })
      if (!account) {
        return forbidden(new EmailInUseError())
      }
      const accessToken = await this.authentication.auth({
        email,
        password
      })

      return ok({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
