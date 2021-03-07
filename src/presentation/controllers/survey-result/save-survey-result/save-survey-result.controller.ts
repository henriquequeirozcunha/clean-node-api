import { AccessDeniedError } from '@/presentation/erros'
import { serverError, ok, forbidden } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { SaveSurveySurveyResult } from '@/domain/usecases/survey-result/save-survey-result'
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveySurveyResult: SaveSurveySurveyResult) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const survey = await this.loadSurveyById.loadById(httpRequest.params.surveyId)
      if (!survey) {
        return forbidden(new AccessDeniedError())
      }
      const { accountId, answer, date, surveyId } = httpRequest.body
      await this.saveSurveySurveyResult.save({
        accountId,
        answer,
        date,
        surveyId
      })

      return ok({})
    } catch (error) {
      return serverError(error)
    }
  }
}
