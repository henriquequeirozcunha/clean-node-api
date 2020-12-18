import { Validation } from './../../helpers/validators/validation'
import { AddAccount } from '../../../domain/usecases/add-account'
import { serverError, ok , badRequest } from '../../helpers/http-helper'
import { InvalidParamError } from '../../erros'
import { Controller, HttpResponse, HttpRequest } from '../../protocols'
import { EmailValidator } from '../../protocols/email-validator'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount
  private readonly validation: Validation

  constructor (emailValidator: EmailValidator, addAccount: AddAccount, validation: Validation) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { password, email, name } = httpRequest.body

      // const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      // for (const field of requiredFields) {
      //   if (!httpRequest.body[field]) {
      //     return badRequest(new MissingParamError(field))
      //   }
      // }
      // if (password !== passwordConfirmation) {
      //   return badRequest(new InvalidParamError('passwordConfirmation'))
      // }
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
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
