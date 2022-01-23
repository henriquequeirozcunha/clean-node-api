import { ApolloServer } from 'apollo-server-express'
import { Express } from 'express'
import typeDefs from '@/main/graphql/type-defs'
import resolvers from '@/main/graphql/resolvers'

export default (app: Express): ApolloServer => {
  const server = new ApolloServer({
    resolvers,
    typeDefs
  })

  return server
}
