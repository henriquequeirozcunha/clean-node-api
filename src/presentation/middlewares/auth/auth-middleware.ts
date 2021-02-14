import { AccessDeniedError } from './../../erros/access-denied-error'
import { forbidden } from './../../helpers/http/http-helper'
import { Middleware } from './../../protocols/middleware'
import { HttpRequest, HttpResponse } from '../../protocols'
export class AuthMiddleware implements Middleware {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = forbidden(new AccessDeniedError())
    return await new Promise(resolve => resolve(error))
  };
}
