import { HttpResponse } from './../protocols/http'
import { MissingParamError } from '../erros/missing-params-error'

export const badRequest = (error: MissingParamError): HttpResponse => ({
  statusCode: 400,
  body: error
})
