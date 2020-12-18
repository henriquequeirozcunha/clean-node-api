import { makeSignUpValidation } from './signup-validation'
import { LogMongoRepository } from './../../infra/db/mongodb/log-repository/log'
import { Controller } from './../../presentation/protocols/controller'
import { LogControllerDecorator } from './../decorators/log'
import { BcryptAdapter } from './../../infra/criptography/bcrypt-adapter'
import { DbAddAccount } from './../../data/usecases/add-account/add-account'
import { SignUpController } from '../../presentation/controllers/signup/signup'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
  const validationComposite = makeSignUpValidation()
  const signUpController = new SignUpController(emailValidatorAdapter, dbAddAccount, validationComposite)
  const logErrorRepository = new LogMongoRepository()
  return new LogControllerDecorator(signUpController, logErrorRepository)
}
