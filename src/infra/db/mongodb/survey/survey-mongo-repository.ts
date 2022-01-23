import { LoadSurveyByIdRepository } from './../../../../data/protocols/db/survey/load-survey-by-id-repository'
import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'
import { MongoHelper, QueryBuilder } from '../helpers'
import { ObjectId, ObjectID } from 'mongodb'
import { CheckSurveyByIdRepository } from '@/data/protocols/db/survey/check-survey-by-id-repository'
import { LoadAnswersBySurveyRepository } from '@/data/protocols/db/survey/load-awswers-by-survey-repository'

export class SurveyMongoRepository implements
AddSurveyRepository,
LoadSurveysRepository,
LoadSurveyByIdRepository,
CheckSurveyByIdRepository,
LoadAnswersBySurveyRepository {
  async add (data: AddSurveyRepository.Params): Promise<void> {
    const surveyCollection = await MongoHelper.getColletion('surveys')
    await surveyCollection.insertOne(data)
  }

  async loadAll (accountId: string): Promise<LoadSurveysRepository.Result> {
    const surveyCollection = await MongoHelper.getColletion('surveys')
    const query = new QueryBuilder()
      .lookup({
        from: 'surveyResults',
        foreignField: 'surveyId',
        localField: '_id',
        as: 'result'
      })
      .project({
        _id: 1,
        question: 1,
        answers: 1,
        date: 1,
        didAnswer: {
          $gte: [{
            $size: {
              $filter: {
                input: '$result',
                as: 'item',
                cond: {
                  $eq: ['$$item.accountId', new ObjectId(accountId)]
                }
              }
            }
          }, 1]
        }
      })
      .build()

    const surveys = await surveyCollection.aggregate(query).toArray()
    return surveys && MongoHelper.mapCollection(surveys)
  }

  async loadById (id: string): Promise<LoadSurveyByIdRepository.Result> {
    const surveyCollection = await MongoHelper.getColletion('surveys')
    const survey = await surveyCollection.findOne({ _id: new ObjectID(id) })
    return survey && MongoHelper.map(survey)
  }

  async checkById (id: string): Promise<CheckSurveyByIdRepository.Result> {
    const surveyCollection = await MongoHelper.getColletion('surveys')
    const survey = await surveyCollection.findOne({
      _id: new ObjectID(id)
    }, {
      projection: {
        _id: 1
      }
    })
    return survey !== null
  }

  async loadAnswers (id: string): Promise<LoadAnswersBySurveyRepository.Result> {
    const surveyCollection = await MongoHelper.getColletion('surveys')
    const query = new QueryBuilder()
      .match({
        _id: new ObjectId(id)
      })
      .project({
        _id: 0,
        answers: '$answers.answer'
      })
      .build()
    const surveys = await surveyCollection.aggregate(query).toArray()
    return surveys[0]?.answers || []
  }
}
