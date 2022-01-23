import { Controller, Validation, HttpResponse } from '@/presentation/protocols'
import { AddAccount } from '@/domain/usecases/account/add-account'
import { Authentication } from '@/domain/usecases/account/authentication'
import { badRequest, forbidden, serverError, ok } from '@/presentation/helpers/http/http-helper'
import { EmailInUseError } from '@/presentation/erros'

export class SignUpController implements Controller {
  constructor (private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication) { }

  async handle (request: SignUpController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }
      const { password, email, name, role } = request
      const isValid = await this.addAccount.add({
        name,
        email,
        password,
        role
      })
      if (!isValid) {
        return forbidden(new EmailInUseError())
      }
      const authenticationModel = await this.authentication.auth({
        email,
        password
      })

      return ok(authenticationModel)
    } catch (error) {
      return serverError(error)
    }
  }
}
export namespace SignUpController {
  export type Request = {
    email: string
    password: string
    name: string
    role: string
  }
}
