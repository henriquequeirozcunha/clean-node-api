import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'
import { AddSurvey } from '@/domain/usecases/survey/add-survey'
import { SurveyModel } from '@/domain/models/survey'
import { mockSurveyModel, mockSurveyModels } from '@/domain/test'
import { CheckSurveyByIdRepository } from '../protocols/db/survey/check-survey-by-id-repository'
import { LoadAnswersBySurveyRepository } from '../protocols/db/survey/load-awswers-by-survey-repository'

export const makeAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurvey {
    async add (data: AddSurveyRepository.Params): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new AddSurveyRepositoryStub()
}

export const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class DbLoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (id: string): Promise<LoadSurveyByIdRepository.Result> {
      return await Promise.resolve(mockSurveyModel())
    }
  }
  return new DbLoadSurveyByIdRepositoryStub()
}

export const mockLoadAnswersBySurveyRepository = (): LoadAnswersBySurveyRepository => {
  class DbLoadAnswersBySurveyRepositoryStub implements LoadAnswersBySurveyRepository {
    async loadAnswers (id: string): Promise<LoadAnswersBySurveyRepository.Result> {
      return await Promise.resolve(['any_answer', 'other_answer'])
    }
  }
  return new DbLoadAnswersBySurveyRepositoryStub()
}

export const makeLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll (accountId: string): Promise<SurveyModel[]> {
      return await Promise.resolve(mockSurveyModels())
    }
  }

  return new LoadSurveysRepositoryStub()
}

export const mockCheckSurveyByIdRepository = (): CheckSurveyByIdRepository => {
  class DbCheckSurveyByIdRepositoryStub implements CheckSurveyByIdRepository {
    async checkById (id: string): Promise<CheckSurveyByIdRepository.Result> {
      return await Promise.resolve(true)
    }
  }
  return new DbCheckSurveyByIdRepositoryStub()
}
