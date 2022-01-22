import { AccountModel } from '@/domain/models/account'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { Collection, ObjectId } from 'mongodb'
import { SurveyModel } from '@/domain/models/survey'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const mockSurvey = async (): Promise<SurveyModel> => {
  const res = await surveyCollection.insertOne({
    id: 'any_id',
    question: 'any_question',
    answers: [{
      answer: 'any_answer_1',
      image: 'any_image'
    },
    {
      answer: 'any_answer__2'
    },
    {
      answer: 'any_answer__3'
    }],
    date: new Date()
  })

  return MongoHelper.map(res.ops[0])
}

const mockAccount = async (): Promise<AccountModel> => {
  const res = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email',
    password: 'any_password'
  })

  return MongoHelper.map(res.ops[0])
}

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

describe('SurveyResult MongoDB Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    surveyCollection = await MongoHelper.getColletion('surveys')
    await surveyCollection.deleteMany({})
    surveyResultCollection = await MongoHelper.getColletion('surveysResults')
    await surveyResultCollection.deleteMany({})
    accountCollection = await MongoHelper.getColletion('accounts')
    await accountCollection.deleteMany({})
  })
  describe('save()', () => {
    test('Should add surveyResult if it is new', async () => {
      const survey = await mockSurvey()
      const account = await mockAccount()
      const sut = makeSut()
      await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })
      const surveyResult = await surveyResultCollection.findOne({
        surveyId: survey.id,
        accountId: account.id
      })
      expect(surveyResult).toBeTruthy()
    })
    test('Should update surveyResult if it is not new', async () => {
      const survey = await mockSurvey()
      const account = await mockAccount()
      await surveyResultCollection.insertOne({
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id),
        answer: survey.answers[0].answer,
        date: new Date()
      })
      const sut = makeSut()
      await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[1].answer,
        date: new Date()
      })
      const surveyResult = await surveyResultCollection.find({
        surveyId: survey.id,
        accountId: account.id
      }).toArray()
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.length).toBe(1)
    })
  })
  describe('loadBySurveyId()', () => {
    test('Should load surveyResult', async () => {
      const survey = await mockSurvey()
      const account = await mockAccount()
      const account2 = await mockAccount()
      await surveyResultCollection.insertMany([{
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id),
        answer: survey.answers[0].answer,
        date: new Date()
      },
      {
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account2.id),
        answer: survey.answers[0].answer,
        date: new Date()
      }])
      const sut = makeSut()
      const surveyResult = await sut.loadBySurveyId(survey.id, account.id)
      expect(surveyResult).toBeTruthy()
      expect(JSON.stringify(surveyResult.surveyId)).toEqual(JSON.stringify(survey.id))
      expect(surveyResult.answers[0].count).toBe(2)
      expect(surveyResult.answers[0].percent).toBe(100)
      expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(true)
      expect(surveyResult.answers[1].count).toBe(0)
      expect(surveyResult.answers[1].percent).toBe(0)
      expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false)
    })
    test('Should load surveyResult 2', async () => {
      const survey = await mockSurvey()
      const account = await mockAccount()
      const account2 = await mockAccount()
      const account3 = await mockAccount()
      await surveyResultCollection.insertMany([{
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id),
        answer: survey.answers[0].answer,
        date: new Date()
      },
      {
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account2.id),
        answer: survey.answers[1].answer,
        date: new Date()
      },
      {
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account3.id),
        answer: survey.answers[1].answer,
        date: new Date()
      }])
      const sut = makeSut()
      const surveyResult = await sut.loadBySurveyId(survey.id, account2.id)
      expect(surveyResult).toBeTruthy()
      expect(JSON.stringify(surveyResult.surveyId)).toEqual(JSON.stringify(survey.id))
      expect(surveyResult.answers[0].count).toBe(2)
      expect(surveyResult.answers[0].percent).toBe(67)
      expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(true)
      expect(surveyResult.answers[1].count).toBe(1)
      expect(surveyResult.answers[1].percent).toBe(33)
      expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false)
    })
    test('Should load surveyResult 3', async () => {
      const survey = await mockSurvey()
      const account = await mockAccount()
      const account2 = await mockAccount()
      const account3 = await mockAccount()
      await surveyResultCollection.insertMany([{
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id),
        answer: survey.answers[0].answer,
        date: new Date()
      },
      {
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account2.id),
        answer: survey.answers[1].answer,
        date: new Date()
      }])
      const sut = makeSut()
      const surveyResult = await sut.loadBySurveyId(survey.id, account3.id)
      expect(surveyResult).toBeTruthy()
      expect(JSON.stringify(surveyResult.surveyId)).toEqual(JSON.stringify(survey.id))
      expect(surveyResult.answers[0].count).toBe(1)
      expect(surveyResult.answers[0].percent).toBe(50)
      expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(false)
      expect(surveyResult.answers[1].count).toBe(1)
      expect(surveyResult.answers[1].percent).toBe(50)
      expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false)
    })
    test('Should return null if there is no survey result', async () => {
      const survey = await mockSurvey()
      const account = await mockAccount()
      const sut = makeSut()
      const surveyResult = await sut.loadBySurveyId(survey.id, account.id)
      expect(surveyResult).toBeNull()
    })
  })
})
