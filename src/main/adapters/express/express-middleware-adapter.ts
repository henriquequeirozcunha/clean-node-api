import { Request, Response, NextFunction } from 'express'
import { Middleware } from '@/presentation/protocols/middleware'

export const adaptMiddleware = (middleware: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const request: any = {
      accessToken: req.headers?.['x-access-token'],
      ...(req.headers || {})
    }
    const httpResponse = await middleware.handle(request)
    if (httpResponse.statusCode === 200) {
      Object.assign(req, httpResponse.body)
      next()
    } else {
      res.status(httpResponse.statusCode).json({
        error: httpResponse.body.message
      })
    }
  }
}
