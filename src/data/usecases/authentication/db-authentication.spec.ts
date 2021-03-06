import { DbAuthentication } from './db-authentication'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository'
import { HashComparer } from '@/data/protocols/criptography/hash-comparer'
import { Encrypter } from '@/data/protocols/criptography/encrypter'
import { UpdateAccessTokenRepository } from '@/data/protocols/db/account/update-access-token-repository'
import { AuthenticationModel } from '@/domain/usecases/authentication'
import { AccountModel } from '@/domain/models/account'

type SutTypes = {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  encrypterStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeFakeAuthenticationModel = (): AuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password'
})

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
  implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
      return await new Promise((resolve) => resolve(makeFakeAccount()))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}
const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (password: string, hash: string): Promise<boolean> {
      return true
    }
  }
  return new HashComparerStub()
}
const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (id: string): Promise<string> {
      return 'any_token'
    }
  }
  return new EncrypterStub()
}
const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken (id: string, token: string): Promise<void> {}
  }
  return new UpdateAccessTokenRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const hashComparerStub = makeHashComparer()
  const encrypterStub = makeEncrypter()
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository()
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
    const fakeAuthentication = makeFakeAuthenticationModel()
    await sut.auth(fakeAuthentication)
    expect(loadSpy).toHaveBeenCalledWith(fakeAuthentication.email)
  })
  test('Should throw an error if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const fakeAuthentication = makeFakeAuthenticationModel()
    const promise = sut.auth(fakeAuthentication)
    await expect(promise).rejects.toThrow()
  })
  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(null)
    const fakeAuthentication = makeFakeAuthenticationModel()
    const response = await sut.auth(fakeAuthentication)
    expect(response).toBeNull()
  })
  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    const fakeAuthentication = makeFakeAuthenticationModel()
    await sut.auth(fakeAuthentication)
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })
  test('Should throw an error if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest
      .spyOn(hashComparerStub, 'compare')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const fakeAuthentication = makeFakeAuthenticationModel()
    const promise = sut.auth(fakeAuthentication)
    await expect(promise).rejects.toThrow()
  })
  test('Should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest
      .spyOn(hashComparerStub, 'compare')
      .mockReturnValueOnce(new Promise((resolve) => resolve(false)))
    const fakeAuthentication = makeFakeAuthenticationModel()
    const accessToken = await sut.auth(fakeAuthentication)
    expect(accessToken).toBeNull()
  })
  test('Should call Encrypter with correct values', async () => {
    const { sut, encrypterStub } = makeSut()
    const generateSpy = jest.spyOn(encrypterStub, 'encrypt')
    const fakeAuthentication = makeFakeAuthenticationModel()
    await sut.auth(fakeAuthentication)
    expect(generateSpy).toBeCalledWith('any_id')
  })
  test('Should throw an error if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest
      .spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const fakeAuthentication = makeFakeAuthenticationModel()
    const promise = sut.auth(fakeAuthentication)
    await expect(promise).rejects.toThrow()
  })
  test('Should throw an error if Encrypter throws', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth(makeFakeAuthenticationModel())
    await expect(accessToken).toBe('any_token')
  })
  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(
      updateAccessTokenRepositoryStub,
      'updateAccessToken'
    )
    const fakeAuthentication = makeFakeAuthenticationModel()
    await sut.auth(fakeAuthentication)
    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })
})
