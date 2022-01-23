import { mockSurveyResultModel, throwError } from '@/domain/test'
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result'
import { InvalidParamError } from '@/presentation/erros'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { mockCheckSurveyById, mockLoadSurveyResult } from '@/presentation/test'
import { LoadSurveyResultController } from './load-survey-result.controller'
import faker from 'faker'
import { CheckSurveyById } from '@/domain/usecases/survey/check-survey-by-id'

const mockRequest = (): LoadSurveyResultController.Request => ({
  accountId: faker.random.uuid(),
  surveyId: faker.random.uuid()
})

type SutTypes = {
  sut: LoadSurveyResultController
  checkSurveyByIdStub: CheckSurveyById
  loadSurveyResultStub: LoadSurveyResult
}

const makeSut = (): SutTypes => {
  const loadSurveyResultStub = mockLoadSurveyResult()
  const checkSurveyByIdStub = mockCheckSurveyById()
  const sut = new LoadSurveyResultController(checkSurveyByIdStub, loadSurveyResultStub)

  return {
    sut,
    checkSurveyByIdStub,
    loadSurveyResultStub
  }
}

describe('LoadSurveyResult Controller', () => {
  test('should call CheckSurveyById with correct values', async () => {
    const { sut, checkSurveyByIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(checkSurveyByIdStub, 'checkById')

    const request = mockRequest()

    await sut.handle(request)

    expect(loadByIdSpy).toHaveBeenCalledWith(request.surveyId)
  })
  test('should return 403 if CheckSurveyById returns false', async () => {
    const { sut, checkSurveyByIdStub } = makeSut()
    jest.spyOn(checkSurveyByIdStub, 'checkById').mockReturnValueOnce(Promise.resolve(false))

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })
  test('should return 500 if CheckSurveyById throws an exception', async () => {
    const { sut, checkSurveyByIdStub } = makeSut()
    jest.spyOn(checkSurveyByIdStub, 'checkById').mockImplementationOnce(throwError)

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })
  test('should call LoadSurveyResult with correct values', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyResultStub, 'load')
    const request = mockRequest()

    await sut.handle(request)

    expect(loadSpy).toHaveBeenCalledWith(request.surveyId, request.accountId)
  })
  test('should return 200 with SurveyResult data on success', async () => {
    const { sut } = makeSut()
    const surveyResult = await sut.handle(mockRequest())

    expect(surveyResult).toEqual(ok(mockSurveyResultModel()))
  })
})
