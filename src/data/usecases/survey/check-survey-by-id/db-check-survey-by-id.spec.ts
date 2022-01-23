import MockDate from 'mockdate'
import { DbCheckSurveyById } from './db-check-survey-by-id'
import { CheckSurveyByIdRepository } from '@/data/protocols/db/survey/check-survey-by-id-repository'
import { mockCheckSurveyByIdRepository } from '@/data/test'

type SutTypes = {
  sut: DbCheckSurveyById
  checkSurveyByIdRepositoryStub: CheckSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const checkSurveyByIdRepositoryStub = mockCheckSurveyByIdRepository()
  const sut = new DbCheckSurveyById(checkSurveyByIdRepositoryStub)

  return {
    sut,
    checkSurveyByIdRepositoryStub
  }
}

describe('DbCheckSurveyById', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('Should call CheckSurveyByIdRepository with correct id', async () => {
    const { sut, checkSurveyByIdRepositoryStub } = makeSut()
    const checkByIdSpy = jest.spyOn(checkSurveyByIdRepositoryStub, 'checkById')
    await sut.checkById('any_id')
    expect(checkByIdSpy).toHaveBeenCalledWith('any_id')
  })
  test('Should return true if CheckSurveyByIdRepository returns true', async () => {
    const { sut } = makeSut()
    const exists = await sut.checkById('any_id')
    expect(exists).toEqual(true)
  })
  test('Should return false if CheckSurveyByIdRepository returns false', async () => {
    const { sut, checkSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(checkSurveyByIdRepositoryStub, 'checkById').mockReturnValueOnce(Promise.resolve(false))
    const surveys = await sut.checkById('any_id')
    expect(surveys).toEqual(false)
  })
  test('Should throw an exception if CheckSurveyByIdRepository throws', async () => {
    const { sut, checkSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(checkSurveyByIdRepositoryStub, 'checkById').mockRejectedValueOnce(new Error())
    const promise = sut.checkById('any_id')
    await expect(promise).rejects.toThrow()
  })
})
