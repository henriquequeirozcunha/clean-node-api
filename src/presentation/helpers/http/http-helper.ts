import { UnauthorizedError } from '../../erros/unauthorized-error'
import { ServerError } from '../../erros/server-error'
import { HttpResponse } from '../../protocols/http'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})
export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError()
})
export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack)
})
export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})