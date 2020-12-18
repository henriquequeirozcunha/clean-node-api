import { InvalidParamError } from './../../erros/invalid-params-error'
import { EmailValidator } from './../../protocols/email-validator'
import { badRequest, serverError } from './../../helpers/http-helper'
import { Controller } from './../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../protocols/http'
import { MissingParamError } from '../../erros'
export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body
      if (!email) {
        return await new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
      }
      if (!password) {
        return await new Promise(resolve => resolve(badRequest(new MissingParamError('password'))))
      }
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return await new Promise(resolve => resolve(badRequest(new InvalidParamError('email'))))
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
