import MockDate from 'mockdate'
import { DbSaveSurveyResult } from './db-save-survey-result'
import { SaveSurveyResult, SaveSurveyResultModel } from '@/domain/usecases/survey-result/save-survey-result'
import { SurveyResultModel } from '@/domain/models/survey-result'

const makeFakeSurveyResultData = (): SaveSurveyResultModel => ({
  surveyId: 'survey_id',
  accountId: 'account_id',
  answer: 'answer_id',
  date: new Date()
})

const makeFakeSurveyResult = (): SurveyResultModel => Object.assign({}, makeFakeSurveyResultData(), {
  id: 'any_id'
})

const makeSaveSurveyResultRepository = (): SaveSurveyResult => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return await new Promise((resolve) => resolve(makeFakeSurveyResult()))
    }
  }
  return new SaveSurveyResultRepositoryStub()
}

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResult
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)
  return {
    sut,
    saveSurveyResultRepositoryStub
  }
}

describe('DbSaveSurveyResult UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')
    await sut.save(makeFakeSurveyResultData())
    expect(addSpy).toHaveBeenCalledWith(makeFakeSurveyResultData())
  })
  test('Should throw if SurveyResultRepositoryStub throws ', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockRejectedValueOnce(new Error())
    const promise = sut.save(makeFakeSurveyResultData())
    await expect(promise).rejects.toThrow()
  })
  test('Should a Surveys Result on success', async () => {
    const { sut } = makeSut()
    const surveyResult = await sut.save(makeFakeSurveyResultData())
    expect(surveyResult).toEqual(makeFakeSurveyResult())
  })
})
