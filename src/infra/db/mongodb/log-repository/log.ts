import { MongoHelper } from './../helpers/mongo-helper'
import { LogErrorRepository } from '../../../../data/protocols/log-error-repository'

export class LogMongoRepository implements LogErrorRepository {
  async logError (errorStack: string): Promise<void> {
    const errorCollection = await MongoHelper.getColletion('errors')
    await errorCollection.insertOne({
      stack: errorStack,
      date: new Date()
    })
  }
}
