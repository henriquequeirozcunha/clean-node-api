import { mockEncrypter, mockHashComparer } from '@/data/test/mock-criptography'
import { DbAuthentication } from './db-authentication'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository'
import { HashComparer } from '@/data/protocols/criptography/hash-comparer'
import { Encrypter } from '@/data/protocols/criptography/encrypter'
import { UpdateAccessTokenRepository } from '@/data/protocols/db/account/update-access-token-repository'
import { throwError, mockAuthentication } from '@/domain/test'
import { mockLoadAccountByEmailRepository, mockUpdateAccessTokenRepository } from '@/data/test'

type SutTypes = {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  encrypterStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
  const hashComparerStub = mockHashComparer()
  const encrypterStub = mockEncrypter()
  const updateAccessTokenRepositoryStub = mockUpdateAccessTokenRepository()
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  )
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  }
}

describe('DbAuthentication usecase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    const fakeAuthentication = mockAuthentication()
    await sut.auth(fakeAuthentication)
    expect(loadSpy).toHaveBeenCalledWith(fakeAuthentication.email)
  })
  test('Should throw an error if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockImplementationOnce(throwError)
    const fakeAuthentication = mockAuthentication()
    const promise = sut.auth(fakeAuthentication)
    await expect(promise).rejects.toThrow()
  })
  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(null)
    const fakeAuthentication = mockAuthentication()
    const model = await sut.auth(fakeAuthentication)
    expect(model).toBeNull()
  })
  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    const fakeAuthentication = mockAuthentication()
    await sut.auth(fakeAuthentication)
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'any_password')
  })
  test('Should throw an error if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest
      .spyOn(hashComparerStub, 'compare')
      .mockImplementationOnce(throwError)
    const fakeAuthentication = mockAuthentication()
    const promise = sut.auth(fakeAuthentication)
    await expect(promise).rejects.toThrow()
  })
  test('Should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest
      .spyOn(hashComparerStub, 'compare')
      .mockReturnValueOnce(Promise.resolve(false))
    const fakeAuthentication = mockAuthentication()
    const model = await sut.auth(fakeAuthentication)
    expect(model).toBeNull()
  })
  test('Should call Encrypter with correct values', async () => {
    const { sut, encrypterStub } = makeSut()
    const generateSpy = jest.spyOn(encrypterStub, 'encrypt')
    const fakeAuthentication = mockAuthentication()
    await sut.auth(fakeAuthentication)
    expect(generateSpy).toBeCalledWith('any_id')
  })
  test('Should throw an error if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest
      .spyOn(encrypterStub, 'encrypt')
      .mockImplementationOnce(throwError)
    const fakeAuthentication = mockAuthentication()
    const promise = sut.auth(fakeAuthentication)
    await expect(promise).rejects.toThrow()
  })
  test('Should return an authentication model on sucess', async () => {
    const { sut } = makeSut()
    const { accessToken, name } = await sut.auth(mockAuthentication())
    expect(accessToken).toBe('any_token')
    expect(name).toBe('any_name')
  })
  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(
      updateAccessTokenRepositoryStub,
      'updateAccessToken'
    )
    const fakeAuthentication = mockAuthentication()
    await sut.auth(fakeAuthentication)
    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })
})
