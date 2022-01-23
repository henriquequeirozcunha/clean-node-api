import { DbLoadAnswersBySurvey } from './db-load-answers-by-survey'
import { mockLoadAnswersBySurveyRepository } from '@/data/test'
import { mockSurveyModel, throwError } from '@/domain/test'
import { LoadAnswersBySurveyRepository } from '@/data/protocols/db/survey/load-awswers-by-survey-repository'

type SutTypes = {
  sut: DbLoadAnswersBySurvey
  loadAnswersBySurveyRepositoryStub: LoadAnswersBySurveyRepository
}

const makeSut = (): SutTypes => {
  const loadAnswersBySurveyRepositoryStub = mockLoadAnswersBySurveyRepository()
  const sut = new DbLoadAnswersBySurvey(loadAnswersBySurveyRepositoryStub)

  return {
    sut,
    loadAnswersBySurveyRepositoryStub
  }
}

describe('DbLoadSurveyById', () => {
  test('Should call LoadAnswersBySurveyRepository with correct id', async () => {
    const { sut, loadAnswersBySurveyRepositoryStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadAnswersBySurveyRepositoryStub, 'loadAnswers')
    await sut.loadAnswers('any_id')
    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
  })
  test('Should return empty array if LoadAnswersBySurveyRepository returns []', async () => {
    const { sut, loadAnswersBySurveyRepositoryStub } = makeSut()
    jest.spyOn(loadAnswersBySurveyRepositoryStub, 'loadAnswers').mockReturnValueOnce(Promise.resolve([]))
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
  test('Should throw an exception if LoadAnswersBySurveyRepository throws', async () => {
    const { sut, loadAnswersBySurveyRepositoryStub } = makeSut()
    jest.spyOn(loadAnswersBySurveyRepositoryStub, 'loadAnswers').mockRejectedValueOnce(throwError)
    const promise = sut.loadAnswers('any_id')
    await expect(promise).rejects.toThrow()
  })
})
