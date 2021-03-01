import { serverError, noContent } from './../../../helpers/http/http-helper'
import { LoadSurveys } from './../../../../domain/usecases/load-survey'
import { Controller, HttpRequest, HttpResponse } from '../../../protocols'
import { ok } from '../../../helpers/http/http-helper'

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load()
      return surveys?.length ? ok(surveys) : noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
