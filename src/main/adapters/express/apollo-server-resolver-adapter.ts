import { Controller } from '@/presentation/protocols'

export const adaptResolver = async (controller: Controller, args: any): Promise<any> => {
  const loginContoller = controller
  const httpResponse = await loginContoller.handle(args)

  return httpResponse.body
}
