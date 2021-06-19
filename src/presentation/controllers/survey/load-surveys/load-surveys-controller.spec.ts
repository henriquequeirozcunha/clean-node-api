import MockDate from 'mockdate'
import { SurveyModel } from '@/domain/models/survey'
import { LoadSurveys } from '@/domain/usecases/survey/load-survey'
import { LoadSurveysController } from './load-surveys-controller'
import {
  noContent,
  serverError,
  ok
} from '@/presentation/helpers/http/http-helper'

const mockSurveyModel = (): SurveyModel[] => {
  return [
    {
      id: 'any_id',
      question: 'any_question',
      answers: [
        {
          image: 'any_image',
          answer: 'any_answer'
        }
      ],
      date: new Date()
    },
    {
      id: 'other_id',
      question: 'other_question',
      answers: [
        {
          image: 'other_image',
          answer: 'other_answer'
        }
      ],
      date: new Date()
    }
  ]
}
const makeLoadSurveysStub = (): LoadSurveys => {
  class LoadSurveysSutb implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return await new Promise((resolve) => resolve(mockSurveyModel()))
    }
  }
  return new LoadSurveysSutb()
}
type SutTypes = {
  sut: LoadSurveysController
  loadSurveysStub: LoadSurveys
}
const makeSut = (): SutTypes => {
  const loadSurveysStub = makeLoadSurveysStub()
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
  test('Should call LoadSurveys', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')
    await sut.handle({})
    expect(loadSpy).toHaveBeenCalled()
  })
  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpRespone = await sut.handle({})
    expect(httpRespone).toEqual(ok(mockSurveyModel()))
  })
  test('Should return 204 if LoadSurveys returns empty', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(new Promise((resolve) => resolve([])))
    const httpReponse = await sut.handle({})
    expect(httpReponse).toEqual(noContent())
  })
  test('Should return 500 if AddSurvey throws', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const httpReponse = await sut.handle({})
    expect(httpReponse).toEqual(serverError(new Error()))
  })
})
