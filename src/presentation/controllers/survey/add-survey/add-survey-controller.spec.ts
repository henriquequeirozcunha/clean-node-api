import MockDate from 'mockdate'
import { Validation } from '@/presentation/protocols'
import { AddSurvey } from '@/domain/usecases/survey/add-survey'
import { AddSurveyController } from './add-survey-controller'
import {
  badRequest,
  serverError,
  noContent
} from '@/presentation/helpers/http/http-helper'
import { throwError } from '@/domain/test'
import { mockValidation, mockAddSurvey } from '@/presentation/test'

const mockRequest = (): AddSurveyController.Request => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer'
    }
  ]
})

type SutTypes = {
  sut: AddSurveyController
  validationStub: Validation
  addSurveyStub: AddSurvey
}

const makeSut = (): SutTypes => {
  const validationStub = mockValidation()
  const addSurveyStub = mockAddSurvey()
  const sut = new AddSurveyController(validationStub, addSurveyStub)
  return {
    sut,
    validationStub,
    addSurveyStub
  }
}

describe('AddSurveyController', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('Should call validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const request = mockRequest()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(request)
    expect(validateSpy).toHaveBeenCalledWith(request)
  })
  test('Should return 400 if validation fails', async () => {
    const { sut, validationStub } = makeSut()
    const request = mockRequest()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(badRequest(new Error()))
  })
  test('Should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut()
    const request = mockRequest()
    const addSpy = jest.spyOn(addSurveyStub, 'add')
    await sut.handle(request)
    expect(addSpy).toHaveBeenCalledWith({ ...request, date: new Date() })
  })
  test('Should return 500 if AddSurvey throws', async () => {
    const { sut, addSurveyStub } = makeSut()
    const request = mockRequest()
    jest
      .spyOn(addSurveyStub, 'add')
      .mockImplementationOnce(throwError)
    const httpReponse = await sut.handle(request)
    expect(httpReponse).toEqual(serverError(new Error()))
  })
  test('Should return 204 on success', async () => {
    const { sut } = makeSut()
    const request = mockRequest()
    const httpReponse = await sut.handle(request)
    expect(httpReponse).toEqual(noContent())
  })
})
