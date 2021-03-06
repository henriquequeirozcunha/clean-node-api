import { LoadSurveyByIdRepository } from './../../protocols/db/survey/load-survey-by-id-repository'
import { LoadSurveyById } from '@/domain/usecases/load-survey-by-id'
import { SurveyModel } from '@/domain/models/survey'

export class DbLoadSurveyById implements LoadSurveyById {
  constructor (private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository) {}
  async loadById (id: string): Promise<SurveyModel> {
    return await this.loadSurveyByIdRepository.loadById(id)
  }
}
