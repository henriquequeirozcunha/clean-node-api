import { SurveyResultModel } from '@/domain/models/survey-result'

export interface LoadSurveyResult {
  load: (id: string) => Promise<SurveyResultModel>
}
