import { adaptResolver } from '@/main/adapters/express/apollo-server-resolver-adapter'
import { makeLoadSurveysController } from '@/main/factories/controllers/survey/load-surveys/load-surveys-controller-factory'

export default {
  Query: {
    surveys: async () => adaptResolver(makeLoadSurveysController())
  }
}
