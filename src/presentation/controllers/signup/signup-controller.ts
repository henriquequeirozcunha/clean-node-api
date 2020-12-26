import { Validation } from '../../protocols/validation'
import { AddAccount } from '../../../domain/usecases/add-account'
import { serverError, ok , badRequest } from '../../helpers/http/http-helper'
import { Controller, HttpResponse, HttpRequest } from '../../protocols'

export class SignUpController implements Controller {
  constructor (private readonly addAccount: AddAccount, private readonly validation: Validation) { }

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
      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
