import { InvalidParamError } from '@/presentation/erros'
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
      const { surveyId } = httpRequest.params
      const { answer } = httpRequest.body
      const survey = await this.loadSurveyById.loadById(surveyId)
      console.log('survey', survey)
      console.log('answer', answer)
      if (survey) {
        if (!survey.answers.some(surveyAnswer => surveyAnswer.answer === answer)) {
          return forbidden(new InvalidParamError('answer'))
        }
      } else {
        return forbidden(new InvalidParamError('surveyId'))
      }
      return ok({})
    } catch (error) {
      return serverError(error)
    }
  }
}
