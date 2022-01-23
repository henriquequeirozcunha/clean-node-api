import { DbAddAccount } from './db-add-account'
import { Hasher } from '@/data/protocols/criptography/hasher'
import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository'
import { mockAddAccountParams, throwError } from '@/domain/test'
import { mockHasher } from '@/data/test/mock-criptography'
import { mockAddAccountRepository, mockCheckAccountByEmailRepository } from '@/data/test'
import { CheckAccountByEmailRepository } from '@/data/protocols/db/account/check-account-by-email-repository'

type SutTypes = {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  checkAccountByEmailRepositoryStub: CheckAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const hasherStub = mockHasher()
  const addAccountRepositoryStub = mockAddAccountRepository()
  const checkAccountByEmailRepositoryStub = mockCheckAccountByEmailRepository()
  const sut = new DbAddAccount(
    hasherStub,
    addAccountRepositoryStub,
    checkAccountByEmailRepositoryStub
  )
  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    checkAccountByEmailRepositoryStub
  }
}

describe('DbAddAccount UseCase', () => {
  test('Should call Hasher with correct password ', async () => {
    const { sut, hasherStub } = makeSut()

    const encryptSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(mockAddAccountParams())
    expect(encryptSpy).toHaveBeenCalledWith('any_password')
  })
  test('Should throw if Hasher throws ', async () => {
    const { sut, hasherStub } = makeSut()
    jest
      .spyOn(hasherStub, 'hash')
      .mockImplementationOnce(throwError)
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow()
  })
  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.add(mockAddAccountParams())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'hashed_password'
    })
  })
  test('Should throw if AddAccountRepository throws ', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest
      .spyOn(addAccountRepositoryStub, 'add')
      .mockImplementationOnce(throwError)
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow()
  })
  test('Should return true if CheckAccountByEmailRepository returns false', async () => {
    const { sut } = makeSut()
    const isValid = await sut.add(mockAddAccountParams())
    expect(isValid).toBe(true)
  })
  test('Should return false if AddAccountRepository returns false', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(Promise.resolve(false))
    const isValid = await sut.add(mockAddAccountParams())
    expect(isValid).toBe(false)
  })
  test('Should call CheckAccountByEmailRepository with correct email', async () => {
    const { sut, checkAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(checkAccountByEmailRepositoryStub, 'checkByEmail')
    const fakeAccount = mockAddAccountParams()
    await sut.add(fakeAccount)
    expect(loadSpy).toHaveBeenCalledWith(fakeAccount.email)
  })
  test('Should throw an error if CheckAccountByEmailRepository throws', async () => {
    const { sut, checkAccountByEmailRepositoryStub } = makeSut()
    jest
      .spyOn(checkAccountByEmailRepositoryStub, 'checkByEmail')
      .mockImplementationOnce(throwError)
    const fakeAccount = mockAddAccountParams()
    const promise = sut.add(fakeAccount)
    await expect(promise).rejects.toThrow()
  })
  test('Should return false if CheckAccountByEmailRepository returns true', async () => {
    const { sut, checkAccountByEmailRepositoryStub } = makeSut()
    jest
      .spyOn(checkAccountByEmailRepositoryStub, 'checkByEmail')
      .mockReturnValueOnce(Promise.resolve(true))
    const isValid = await sut.add(mockAddAccountParams())
    expect(isValid).toBe(false)
  })
})
