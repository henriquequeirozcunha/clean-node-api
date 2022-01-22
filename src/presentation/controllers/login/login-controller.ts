import { Controller, Validation, HttpResponse } from '@/presentation/protocols'
import { Authentication } from '@/domain/usecases/account/authentication'
import { badRequest, unauthorized, serverError, ok } from '@/presentation/helpers/http/http-helper'

export class LoginController implements Controller {
  constructor (private readonly validation: Validation, private readonly authentication: Authentication) { }

  async handle (request: LoginController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }
      const { email, password } = request
      const authenticationModel = await this.authentication.auth({ email, password })
      if (!authenticationModel) {
        return unauthorized()
      }
      return ok(authenticationModel)
    } catch (error) {
      return serverError(error)
    }
  }
}
export namespace LoginController {
  export type Request = {
    email: string
    password: string
  }
}
