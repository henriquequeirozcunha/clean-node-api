import { InvalidParamError } from './../../erros/invalid-params-error'
import { ValidationComposite } from './validation-composite'
import { Validation } from './validation'

interface SutTypes {
  sut: ValidationComposite
  validationStub: Validation
}
const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return new InvalidParamError('field')
    }
  }
  return new ValidationStub()
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub()
  const sut = new ValidationComposite([validationStub])
  return {
    sut,
    validationStub
  }
}

describe('ValidatorComposite', () => {
  test('Should returns an error if validation fails', () => {
    const { sut } = makeSut()
    const error = sut.validate({ input: 'any_input' })
    expect(error).toEqual(new InvalidParamError('field'))
  })
})
