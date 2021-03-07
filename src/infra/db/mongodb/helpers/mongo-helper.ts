import { MongoClient, Collection } from 'mongodb'

interface IMongoHelper {
  client: MongoClient
  uri: string
  connect: (uri: string) => Promise<void>
  disconnect: () => Promise<void>
  getColletion: (name: string) => Promise<Collection>
  map: (collection: any) => any
  mapCollection: (collection: any[]) => any[]
}

export const MongoHelper: IMongoHelper = {
  client: null as MongoClient,
  uri: null as string,

  async connect (uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  },
  async disconnect (): Promise<void> {
    await this.client.close()
    this.client = null
  },
  async getColletion (name: string): Promise<Collection> {
    if (!this.client?.isConnected()) { await this.connect(this.uri) }
    return this.client.db().collection(name)
  },
  map (collection: any): any {
    const { _id, ...collectionWithoutId } = collection
    return Object.assign({}, collectionWithoutId, { id: _id })
  },
  mapCollection (collection: any[]): any[] {
    return collection.map(item => MongoHelper.map(item))
  }
}
