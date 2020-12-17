import { badRequest } from './../../helpers/http-helper'
import { Controller } from './../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../protocols/http'
import { MissingParamError } from '../../erros'
export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return await new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
  }
}
