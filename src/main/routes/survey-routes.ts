import { auth } from './../config/middleware/auth'
import { makeAddSurveyController } from './../factories/controllers/survey/add-survey/add-survey-controller-factory'
import { Router } from 'express'
import { adaptRoute } from '../adapters/express/express-route-adapter'
import { adminAuth } from '../config/middleware/admin-auth'

export default (router: Router): void => {
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
  router.get('/surveys', auth, adaptRoute(makeAddSurveyController()))
}
