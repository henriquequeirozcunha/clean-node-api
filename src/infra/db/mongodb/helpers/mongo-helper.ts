import { MongoClient, Collection } from 'mongodb'

interface IMongoHelper {
  client: MongoClient
  connect: (uri: string) => Promise<void>
  disconnect: () => Promise<void>
  getColletion: (name: string) => Collection
  map: (collection: any) => any
}

export const MongoHelper: IMongoHelper = {
  client: null as MongoClient,

  async connect (uri: string): Promise<void> {
    this.client = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  },
  async disconnect (): Promise<void> {
    await this.client.close()
  },
  getColletion (name: string): Collection {
    return this.client.db().collection(name)
  },
  map (collection: any): any {
    const { _id, ...collectionWithoutId } = collection
    return Object.assign({}, collectionWithoutId, { id: _id })
  }
}
