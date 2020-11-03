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

/* async function seed() {
  await mongoose.connection.dropDatabase()

  seedDatabase()
}

seed() */
