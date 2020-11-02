import { each, slice, startsWith, trim } from 'lodash'
import { mongoose } from '@typegoose/typegoose'
import 'reflect-metadata'
import { seedDatabase } from './faker'
import RestApi from './RestApi'
import {
  AuthenticationRouter,
  OrdersRouter,
  UsersRouter,
  OfficeRouter,
  CashRouter,
  AdversitementRouter,
  AutocompleteRouter,
  EmailSubscriptionRouter,
} from './routes'
import { ClientRouter } from './routes/clientRoutes'
import { validateEnv } from './utils'
import './services/jobs'
import { ClientModel } from './models'
import e from 'express'

validateEnv()

export const api = new RestApi([
  new AuthenticationRouter(),
  new OrdersRouter(),
  new UsersRouter(),
  new OfficeRouter(),
  new CashRouter(),
  new ClientRouter(),
  new AdversitementRouter(),
  new AutocompleteRouter(),
  new EmailSubscriptionRouter(),
])

api.io.on('connection', () => {
  //
})

api.listen()

async function repairClients() {
  const clients = await ClientModel.find()

  for (const clientKey in clients) {
    const client = clients[clientKey]
    const phones = client.phone
    for (const phoneKey in phones) {
      let phone = phones[phoneKey].phone

      phone = trim(phone)

      if (startsWith(phone, '+7')) {
        phone = phone.slice(2)
      }

      if (startsWith(phone, '7')) {
        phone = phone.slice(1)
      }

      if (startsWith(phone, '8')) {
        phone = phone.slice(1)
      }

      phone = phone.replace(/[^0-9]/g, '')

      if (phone.length < 10) {
        phone = ''
      }

      if (phone.length > 10) {
        phone = phone.substring(0, 10)
      }

      if (phone) {
        client.phone = [
          {
            id: 1,
            phone,
            comment: phones[phoneKey].comment,
          },
        ]
      } else {
        client.phone = []
      }

      await client.save()
    }
  }
}

repairClients()
/* async function seed() {
  await mongoose.connection.dropDatabase()

  seedDatabase()
}

seed() */
