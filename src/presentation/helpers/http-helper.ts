import { ServerError } from './../erros/server-error'
import { HttpResponse } from './../protocols/http'
import { MissingParamError } from '../erros/missing-params-error'

export const badRequest = (error: MissingParamError): HttpResponse => ({
  statusCode: 400,
  body: error
})
export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack)
})
export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})
