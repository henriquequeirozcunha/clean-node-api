import { InvalidParamError } from '@/presentation/erros'
import { serverError, ok, forbidden } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpResponse } from '@/presentation/protocols'
import { SaveSurveyResult } from '@/domain/usecases/survey-result/save-survey-result'
import { LoadAnswersBySurvey } from '@/domain/usecases/survey/load-answers-by-survey'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadAnswersBySurvey: LoadAnswersBySurvey,
    private readonly SaveSurveyResult: SaveSurveyResult) {}

  async handle (request: SaveSurveyResultController.Request): Promise<HttpResponse> {
    try {
      const { surveyId, answer, accountId } = request
      const answers = await this.loadAnswersBySurvey.loadAnswers(surveyId)

      if (!answers) {
        return forbidden(new InvalidParamError('surveyId'))
      } else if (!answers.includes(answer)) {
        return forbidden(new InvalidParamError('answer'))
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
export namespace SaveSurveyResultController {
  export type Request = {
    surveyId: string
    answer: string
    accountId: string
  }
}
