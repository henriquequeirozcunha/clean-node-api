import { Controller } from './../../presentation/protocols/controller'
import { HttpRequest, HttpResponse } from './../../presentation/protocols/http'
import { LogControllerDecorator } from './log'

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const sut = new LogControllerDecorator(controllerStub)
  return {
    sut,
    controllerStub
  }
}

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {
          name: 'Henrique'
        }
      }
      return await new Promise(resolve => resolve(httpResponse))
    }
  }
  return new ControllerStub()
}

describe('LogController Decorator', () => {
  test('Should call Controller Handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest: HttpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'any_name'
      }
    }

    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })
})
