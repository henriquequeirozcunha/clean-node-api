import { ValidationComposite } from '.'
import { Validation } from '@/presentation/protocols'
import { InvalidParamError, MissingParamError } from '@/presentation/erros'
import { mockValidation } from '@/utils/test'

type SutTypes = {
  sut: ValidationComposite
  validationStubs: Validation[]
}

const makeSut = (): SutTypes => {
  const validationStubs = [mockValidation(), mockValidation()]
  const sut = new ValidationComposite(validationStubs)
  return {
    sut,
    validationStubs
  }
}

describe('ValidatorComposite', () => {
  test('Should returns an error if validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest
      .spyOn(validationStubs[1], 'validate')
      .mockReturnValueOnce(new InvalidParamError('field'))
    const error = sut.validate({ input: 'any_input' })
    expect(error).toEqual(new InvalidParamError('field'))
  })
  test('Should returns the first error if more than one validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error())
    jest
      .spyOn(validationStubs[1], 'validate')
      .mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({ input: 'any_input' })
    expect(error).toEqual(new Error())
  })
  test('Should not return if validations succeeds', () => {
    const { sut } = makeSut()
    const error = sut.validate({ input: 'any_input' })
    expect(error).toBeFalsy()
  })
})
