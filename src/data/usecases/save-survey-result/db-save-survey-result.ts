import { SaveSurveyResultRepository } from './../../protocols/db/survey/save-survey-result-repository'
import { SaveSurveySurveyResult, SaveSurveyResultModel } from '@/domain/usecases/save-survey-result'
import { SurveyResultModel } from '@/domain/models/survey-result'

export class DbSaveSurveyResult implements SaveSurveySurveyResult {
  constructor (private readonly saveSurveyResultRepository: SaveSurveyResultRepository) {}
  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const survey = await this.saveSurveyResultRepository.save(data)
    return survey
  }
}
