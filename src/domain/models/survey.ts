import { SurveyItemModel } from './survey-item'

export interface SurveyModel {
  question: string
  answers: SurveyItemModel[]
}
