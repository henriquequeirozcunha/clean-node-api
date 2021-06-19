import MockDate from 'mockdate'
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'
import { DbLoadSurveys } from './db-load-surveys'
import { throwError, mockSurveyModels } from '@/domain/test'
import { makeLoadSurveysRepository } from '@/data/test'

type SutTypes = {
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
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const loadAllSpy = jest.spyOn(loadSurveysStub, 'loadAll')
    await sut.load()
    expect(loadAllSpy).toHaveBeenCalled()
  })
  test('Should a list of Surveys on success', async () => {
    const { sut } = makeSut()
    const surveys = await sut.load()
    expect(surveys).toEqual(mockSurveyModels())
  })
  test('Should throw if LoadSurveysRepository throws ', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest
      .spyOn(loadSurveysStub, 'loadAll')
      .mockImplementationOnce(throwError)
    const promise = sut.load()
    await expect(promise).rejects.toThrow()
  })
})
