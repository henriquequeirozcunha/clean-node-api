import { CheckSurveyByIdRepository } from '@/data/protocols/db/survey/check-survey-by-id-repository'
import { CheckSurveyById } from '@/domain/usecases/survey/check-survey-by-id'

export class DbCheckSurveyById implements CheckSurveyById {
  constructor (private readonly checkSurveyByIdRepository: CheckSurveyByIdRepository) {}
  async checkById (id: string): Promise<CheckSurveyById.Result> {
    return this.checkSurveyByIdRepository.checkById(id)
  }
}
