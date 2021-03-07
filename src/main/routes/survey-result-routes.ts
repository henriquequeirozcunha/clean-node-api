import { Router } from 'express'
import { makeSaveSurveyResultController } from '@/main/factories/controllers/survey-result/save-survey-result/save-survey-result-controller-factory'
import { adaptRoute } from '../adapters/express/express-route-adapter'
import { auth } from '../config/middleware/auth'

export default (router: Router): void => {
  router.put('/surveys/:surveyId/results', auth, adaptRoute(makeSaveSurveyResultController()))
}
