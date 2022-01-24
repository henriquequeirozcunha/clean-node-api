import request from 'supertest'
import { Collection } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { hash } from 'bcrypt'
import { setupApp } from '@/main/config/app'
import { Express } from 'express'

let accountCollection: Collection
let app: Express

describe('Login Routes', () => {
  beforeAll(async () => {
    app = await setupApp()
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    accountCollection = await MongoHelper.getColletion('accounts')
    await accountCollection.deleteMany({})
  })
  describe('POST /signup', () => {
    test('Should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Henrique',
          email: 'henrique@email.com',
          password: '123',
          passwordConfirmation: '123'
        })
        .expect(200)
    })
    test('Should return 403 if email is already in use', async () => {
      const password = await hash('123',12)
      await accountCollection.insertOne({
        name: 'Henrique',
        email: 'henrique@email.com',
        password
      })
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Henrique',
          email: 'henrique@email.com',
          password: '123',
          passwordConfirmation: '123'
        })
        .expect(403)
    })
  })
  describe('POST /login', () => {
    test('Should return 200 on login', async () => {
      const password = await hash('123',12)
      await accountCollection.insertOne({
        name: 'Henrique',
        email: 'henrique@email.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'henrique@email.com',
          password: '123'
        })
        .expect(200)
    })
    test('Should return 401 on invalid credentials', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'henrique@email.com',
          password: '123'
        })
        .expect(401)
    })
  })
})
