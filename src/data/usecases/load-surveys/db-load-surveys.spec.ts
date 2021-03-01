import { DbLoadSurveys } from './db-load-surveys'
import { LoadSurveysRepository } from './../../protocols/db/survey/load-surveys-repository'
import { SurveyModel } from '../../../domain/models/survey'

const makeFakeSurveys = (): SurveyModel[] => {
  return [{
    id: 'any_id',
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  },
  {
    id: 'other_id',
    question: 'other_question',
    answers: [{
      image: 'other_image',
      answer: 'other_answer'
    }],
    date: new Date()
  }]
}

const makeLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll (): Promise<SurveyModel[]> {
      return await new Promise(resolve => resolve(makeFakeSurveys()))
    }
  }

  return new LoadSurveysRepositoryStub()
}

interface SutTypes {
  sut: DbLoadSurveys
  loadSurveysStub: LoadSurveysRepository
}

const makeSut = (): SutTypes => {
  const loadSurveysStub = makeLoadSurveysRepository()
  const sut = new DbLoadSurveys(loadSurveysStub)
  return {
    sut,
    loadSurveysStub
  }
}

describe('DbLoadSurveys', () => {
  test('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const loadAllSpy = jest.spyOn(loadSurveysStub, 'loadAll')
    await sut.load()
    expect(loadAllSpy).toHaveBeenCalled()
  })
  test('Should a list of Surveys on success', async () => {
    const { sut } = makeSut()
    const surveys = await sut.load()
    expect(surveys).toEqual(makeFakeSurveys())
  })
})
