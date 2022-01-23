import { CheckSurveyById } from '@/domain/usecases/survey/check-survey-by-id'
export interface CheckSurveyByIdRepository {
  checkById: (id: string) => Promise<CheckSurveyByIdRepository.Result>
}
export namespace CheckSurveyByIdRepository {
  export type Result = CheckSurveyById.Result
}
