import { Express, Router } from 'express'
import { readdirSync } from 'fs'
// import fg from 'fast-glob'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  // fg.sync('**/src/main/routes/**routes.ts').map(async (file) => (await import(`../../../${file}`)).default(router))
  readdirSync(`${__dirname}/../routes`).map(async (file: string) => {
    if (!file.includes('.test.')) {
      (await import(`../routes/${file}`)).default(router)
    }
  })
}
