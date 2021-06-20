import { AddSurvey, AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { SurveyModel } from '@/domain/models/survey'
import { LoadSurveys } from '@/domain/usecases/survey/load-survey'
import { mockSurveyModels, mockSurveyModel } from '@/domain/test'
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'

export const mockAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (data: AddSurveyParams): Promise<void> {
      return await new Promise((resolve) => resolve())
    }
  }
  return new AddSurveyStub()
}

export const mockLoadSurveysStub = (): LoadSurveys => {
  class LoadSurveysSutb implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return await new Promise((resolve) => resolve(mockSurveyModels()))
    }
  }
  return new LoadSurveysSutb()
}

export const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel> {
      return await new Promise(resolve => resolve(mockSurveyModel()))
    }
  }
  return new LoadSurveyByIdStub()
}
