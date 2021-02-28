import { SurveyMongoRepository } from './survey-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { Collection } from 'mongodb'

let surveyCollection: Collection

describe('Survey MongoDB Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    surveyCollection = await MongoHelper.getColletion('surveys')
    await surveyCollection.deleteMany({})
  })
  const makeSut = (): SurveyMongoRepository => {
    return new SurveyMongoRepository()
  }
  test('Should add a survey on success', async () => {
    const sut = makeSut()
    await sut.add({
      question: 'any_question',
      answers: [{
        answer: 'any_answer',
        image: 'any_image'
      },
      {
        answer: 'other_answer'
      }],
      date: new Date()
    })
    const survey = await surveyCollection.findOne({
      question: 'any_question'
    })
    expect(survey).toBeTruthy()
  })
})
