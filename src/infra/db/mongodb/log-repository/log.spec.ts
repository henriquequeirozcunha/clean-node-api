import { MongoHelper } from '../helpers/mongo-helper'
import { Collection } from 'mongodb'
import { LogMongoRepository } from './log'

describe('Log Mongo Repository', () => {
  let errorCollection: Collection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    errorCollection = await MongoHelper.getColletion('errors')
    await errorCollection.deleteMany({})
  })
  test('Should create an error log on success ', async () => {
    const sut = new LogMongoRepository()
    await sut.logError('any_error')
    const count = await errorCollection.countDocuments()
    // countDocuments retorna a quantidade de documentos na collection. Como no beforeEach ele limpa a tabela.
    // a cada TESTE, no início a tabela fica vazia. Fazendo toBe(1) sigfinica que foi inserido.
    // countDocuments returns the quantity of documents inside the collection. BeforeEach cleans the table
    // on the begining of each test, the tables is empty. By dogin toBe(1) means the insertion worked.
    expect(count).toBe(1)
  })
})
