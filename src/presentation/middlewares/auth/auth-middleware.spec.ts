import { AuthMiddleware } from './auth-middleware'
import { AccessDeniedError } from './../../erros'
import { forbidden } from './../../helpers/http/http-helper'
import { HttpResponse } from './../../protocols/http'

interface SutTypes {
  sut: AuthMiddleware
}
const makeSut = (): SutTypes => {
  const sut = new AuthMiddleware()
  return {
    sut
  }
}

describe('Auth Middleware', () => {
  test('should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse: HttpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
})
