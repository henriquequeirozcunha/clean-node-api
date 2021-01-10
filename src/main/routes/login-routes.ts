import { Router } from 'express'
import { makeLoginController } from '../factories/controllers/login/login/login-controller-factory'
import { adaptRoute } from '../adapters/express/express-route-adapter'
import { makeSignUpController } from '../factories/controllers/login/signup/signup-controller-factory'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()))
  router.post('/login', adaptRoute(makeLoginController()))
}
