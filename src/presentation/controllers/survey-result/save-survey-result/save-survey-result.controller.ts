import { InvalidParamError } from '@/presentation/erros'
import { serverError, ok, forbidden } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { SaveSurveyResult } from '@/domain/usecases/survey-result/save-survey-result'
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly SaveSurveyResult: SaveSurveyResult) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const { answer } = httpRequest.body
      const { accountId } = httpRequest
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (survey) {
        if (!survey.answers.some(surveyAnswer => surveyAnswer.answer === answer)) {
          return forbidden(new InvalidParamError('answer'))
        }
      } else {
        return forbidden(new InvalidParamError('surveyId'))
      }
      const surveyResult = await this.SaveSurveyResult.save({
        accountId,
        surveyId,
        date: new Date(),
        answer
      })
      return ok(surveyResult)
    } catch (error) {
      console.log('erro no servdidor', error)
      return serverError(error)
    }
  }
}
