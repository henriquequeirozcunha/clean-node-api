import { DbLoadAnswersBySurvey } from './db-load-answers-by-survey'
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { mockLoadSurveyByIdRepository } from '@/data/test'
import { mockSurveyModel, throwError } from '@/domain/test'

type SutTypes = {
  sut: DbLoadAnswersBySurvey
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()
  const sut = new DbLoadAnswersBySurvey(loadSurveyByIdRepositoryStub)

  return {
    sut,
    loadSurveyByIdRepositoryStub
  }
}

describe('DbLoadSurveyById', () => {
  test('Should call LoadSurveyByIdRepository with correct id', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    await sut.loadAnswers('any_id')
    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
  })
  test('Should return empty array if loadSurveyByIdRepositoryStub returns null', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockReturnValueOnce(Promise.resolve(null))
    const answers = await sut.loadAnswers('any_id')
    expect(answers).toEqual([])
  })
  test('Should return answers on success', async () => {
    const { sut } = makeSut()
    const surveyMock = mockSurveyModel()
    const answers = await sut.loadAnswers('any_id')
    expect(answers).toEqual([
      surveyMock.answers[0].answer,
      surveyMock.answers[1].answer])
  })
  test('Should throw an exception if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockRejectedValueOnce(throwError)
    const promise = sut.loadAnswers('any_id')
    await expect(promise).rejects.toThrow()
  })
})
