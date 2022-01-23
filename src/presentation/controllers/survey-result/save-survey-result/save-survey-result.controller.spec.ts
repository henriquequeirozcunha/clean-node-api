import MockDate from 'mockdate'
import { InvalidParamError } from '@/presentation/erros'
import { forbidden, serverError, ok } from '@/presentation/helpers/http/http-helper'
import { SaveSurveyResultController } from './save-survey-result.controller'
import { SaveSurveyResult } from '@/domain/usecases/survey-result/save-survey-result'
import { mockLoadAnswersBySurvey, mockSaveSurveyResult } from '@/presentation/test'
import { mockSurveyResultModel } from '@/domain/test'
import { LoadAnswersBySurvey } from '@/domain/usecases/survey/load-answers-by-survey'

const mockRequest = (): SaveSurveyResultController.Request => ({
  surveyId: 'any_survey_id',
  answer: 'any_answer',
  accountId: 'any_account_id'
})

type SutTypes = {
  sut: SaveSurveyResultController
  saveSurveyResultStub: SaveSurveyResult
  loadAnswersBySurveyStub: LoadAnswersBySurvey
}

const makeSut = (): SutTypes => {
  const loadAnswersBySurveyStub = mockLoadAnswersBySurvey()
  const saveSurveyResultStub = mockSaveSurveyResult()
  const sut = new SaveSurveyResultController(loadAnswersBySurveyStub, saveSurveyResultStub)
  return {
    sut,
    loadAnswersBySurveyStub,
    saveSurveyResultStub
  }
}

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('Should call LoadAnswersBySurvey with the correct values', async () => {
    const { sut, loadAnswersBySurveyStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadAnswersBySurveyStub, 'loadAnswers')
    const request = mockRequest()
    await sut.handle(request)
    expect(loadByIdSpy).toHaveBeenCalledWith(request.surveyId)
  })
  test('Should return 403 if LoadAnswersBySurvey returns null', async () => {
    const { sut, loadAnswersBySurveyStub } = makeSut()
    jest.spyOn(loadAnswersBySurveyStub, 'loadAnswers').mockReturnValueOnce(Promise.resolve(null))
    const request = mockRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })
  test('Should return 500 if LoadAnswersBySurvey throws', async () => {
    const { sut, loadAnswersBySurveyStub } = makeSut()
    jest.spyOn(loadAnswersBySurveyStub, 'loadAnswers').mockRejectedValueOnce(new Error())
    const request = mockRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(serverError(new Error()))
  })
  test('Should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({
      surveyId: 'any_survey_id',
      answer: 'wrong_answer',
      accountId: 'any_account_id'
    })
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })
  test('Should call SaveSurveyResult with the correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
    const request = mockRequest()
    await sut.handle(request)
    expect(saveSpy).toHaveBeenCalledWith({
      surveyId: request.surveyId,
      accountId: request.accountId,
      date: new Date(),
      answer: request.answer
    })
  })
  test('Should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    jest.spyOn(saveSurveyResultStub, 'save').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(mockSurveyResultModel()))
  })
})
