import { LoadSurveyByIdRepository } from './../../../../data/protocols/db/survey/load-survey-by-id-repository'
import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyModel } from '@/domain/models/survey'
import { ObjectID } from 'mongodb'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository {
  async add (data: AddSurveyParams): Promise<void> {
    const surveyCollection = await MongoHelper.getColletion('surveys')
    await surveyCollection.insertOne(data)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getColletion('surveys')
    const surveys: SurveyModel[] = await surveyCollection.find().toArray()
    return surveys && MongoHelper.mapCollection(surveys)
  }

  async loadById (id: string): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getColletion('surveys')
    const survey = await surveyCollection.findOne({ _id: new ObjectID(id) })
    return survey && MongoHelper.map(survey)
  }
}
