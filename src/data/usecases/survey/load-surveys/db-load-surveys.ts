import { LoadSurveys } from '@/domain/usecases/survey/load-survey'
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'
import { SurveyModel } from '@/domain/models/survey'

export class DbLoadSurveys implements LoadSurveys {
  constructor (private readonly loadSurveysRepository: LoadSurveysRepository) {}
  async load (accountId: string): Promise<SurveyModel[]> {
    const surveys = await this.loadSurveysRepository.loadAll(accountId)
    return surveys
  }
}
