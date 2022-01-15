import { mockSurveyResultModel, throwError } from '@/domain/test'
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result'
import { InvalidParamError } from '@/presentation/erros'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { HttpRequest } from '@/presentation/protocols'
import { mockLoadSurveyById, mockLoadSurveyResult } from '@/presentation/test'
import { LoadSurveyResultController } from './load-survey-result.controller'

const mockRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id'
  }
})

type SutTypes = {
  sut: LoadSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
  loadSurveyResultStub: LoadSurveyResult
}

const makeSut = (): SutTypes => {
  const loadSurveyResultStub = mockLoadSurveyResult()
  const loadSurveyByIdStub = mockLoadSurveyById()
  const sut = new LoadSurveyResultController(loadSurveyByIdStub, loadSurveyResultStub)

  return {
    sut,
    loadSurveyByIdStub,
    loadSurveyResultStub
  }
}

describe('LoadSurveyResult Controller', () => {
  test('should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')

    await sut.handle(mockRequest())

    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })
  test('should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(Promise.resolve(null))

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })
  test('should return 500 if LoadSurveyById throws an exception', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockImplementationOnce(throwError)

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })
  test('should call LoadSurveyResult with correct values', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyResultStub, 'load')

    await sut.handle(mockRequest())

    expect(loadSpy).toHaveBeenCalledWith('any_survey_id')
  })
  test('should return 200 with SurveyResult data on success', async () => {
    const { sut } = makeSut()
    const surveyResult = await sut.handle(mockRequest())

    expect(surveyResult).toEqual(ok(mockSurveyResultModel()))
  })
})