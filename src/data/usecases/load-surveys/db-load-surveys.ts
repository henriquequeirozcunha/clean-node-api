import { LoadSurveysRepository } from './../../protocols/db/survey/load-surveys-repository'
import { LoadSurveys } from './../../../domain/usecases/load-survey'
import { SurveyModel } from '../../../domain/models/survey'
export class DbLoadSurveys implements LoadSurveys {
  constructor (private readonly loadSurveysRepository: LoadSurveysRepository) {}
  async load (): Promise<SurveyModel[]> {
    await this.loadSurveysRepository.loadAll()
    return []
  }
}
