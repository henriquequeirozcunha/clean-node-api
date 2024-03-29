import MockDate from 'mockdate'
import { LoadSurveys } from '@/domain/usecases/survey/load-survey'
import { LoadSurveysController } from './load-surveys-controller'
import {
  noContent,
  serverError,
  ok
} from '@/presentation/helpers/http/http-helper'
import { mockLoadSurveysStub } from '@/presentation/test'
import { mockSurveyModels } from '@/domain/test'
import faker from 'faker'

const mockRequest = (): LoadSurveysController.Request => ({ accountId: faker.random.uuid() })

type SutTypes = {
  sut: LoadSurveysController
  loadSurveysStub: LoadSurveys
}
const makeSut = (): SutTypes => {
  const loadSurveysStub = mockLoadSurveysStub()
  const sut = new LoadSurveysController(loadSurveysStub)
  return {
    sut,
    loadSurveysStub
  }
}
describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('Should call LoadSurveys with correct value', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')
    const request = mockRequest()
    await sut.handle(request)
    expect(loadSpy).toHaveBeenCalledWith(request.accountId)
  })
  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpRespone = await sut.handle(mockRequest())
    expect(httpRespone).toEqual(ok(mockSurveyModels()))
  })
  test('Should return 204 if LoadSurveys returns empty', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(Promise.resolve([]))
    const httpReponse = await sut.handle(mockRequest())
    expect(httpReponse).toEqual(noContent())
  })
  test('Should return 500 if AddSurvey throws', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(Promise.reject(new Error()))
    const httpReponse = await sut.handle(mockRequest())
    expect(httpReponse).toEqual(serverError(new Error()))
  })
})
