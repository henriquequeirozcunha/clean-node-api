import { LoadAnswersBySurveyRepository } from '@/data/protocols/db/survey/load-awswers-by-survey-repository'
import { LoadAnswersBySurvey } from '@/domain/usecases/survey/load-answers-by-survey'
export class DbLoadAnswersBySurvey implements LoadAnswersBySurvey {
  constructor (private readonly loadAnswersBySurveyRepository: LoadAnswersBySurveyRepository) {}
  async loadAnswers (id: string): Promise<LoadAnswersBySurvey.Result> {
    return this.loadAnswersBySurveyRepository.loadAnswers(id)
  }
}
