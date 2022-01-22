import { HttpResponse } from '@/presentation/protocols'
import { LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token'
import { AuthMiddleware } from './auth-middleware'
import {
  forbidden,
  serverError,
  ok
} from '@/presentation/helpers/http/http-helper'
import { AccessDeniedError } from '@/presentation/erros'
import { throwError } from '@/domain/test'
import { mockLoadAccountByToken } from '@/presentation/test'

const mockRequest = (): AuthMiddleware.Request => ({
  accessToken: 'any_token'
})

type SutTypes = {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}
const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = mockLoadAccountByToken()
  const sut = new AuthMiddleware(loadAccountByTokenStub, role)
  return {
    sut,
    loadAccountByTokenStub
  }
}

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse: HttpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
  test('Should call LoadAccountByToken with correct accessToken', async () => {
    const role = 'any_role'
    const { sut, loadAccountByTokenStub } = makeSut(role)
    const request = mockRequest()
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await sut.handle(request)
    expect(loadSpy).toHaveBeenCalledWith(request.accessToken, role)
  })
  test('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    const request = mockRequest()
    jest
      .spyOn(loadAccountByTokenStub, 'load')
      .mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
  test('Should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut } = makeSut()
    const request = mockRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(ok({ accountId: 'any_id' }))
  })
  test('Should return 500 if LoadAccountByToken throws an error', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    const request = mockRequest()
    jest
      .spyOn(loadAccountByTokenStub, 'load')
      .mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
