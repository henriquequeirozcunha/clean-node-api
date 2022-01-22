import { Controller, HttpResponse } from '@/presentation/protocols'
import { LoadSurveys } from '@/domain/usecases/survey/load-survey'
import { noContent, serverError, ok } from '@/presentation/helpers/http/http-helper'
export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}
  async handle (request: LoadSurveysController.Request): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load(request.accountId)
      return surveys.length ? ok(surveys) : noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
export namespace LoadSurveysController {
  export type Request = {
    accountId: string
  }
}
