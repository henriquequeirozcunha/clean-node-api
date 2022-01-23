import { Authentication } from '@/domain/usecases/account/authentication'

export const mockAuthenticationModel = (): Authentication.Result => ({
  accessToken: 'any_token',
  name: 'any_name'
})
