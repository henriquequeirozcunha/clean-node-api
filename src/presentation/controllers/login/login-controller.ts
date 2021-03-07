import { Controller, Validation, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { Authentication } from '@/domain/usecases/account/authentication'
import { badRequest, unauthorized, serverError, ok } from '@/presentation/helpers/http/http-helper'

export class LoginController implements Controller {
  constructor (private readonly validation: Validation, private readonly authentication: Authentication) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { email, password } = httpRequest.body
      const accessToken = await this.authentication.auth({ email, password })
      if (!accessToken) {
        return unauthorized()
      }
      return ok({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
