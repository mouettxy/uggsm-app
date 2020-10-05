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
} from './routes'
import { ClientRouter } from './routes/clientRoutes'
import { validateEnv } from './utils'

validateEnv()

const api = new RestApi([
  new AuthenticationRouter(),
  new OrdersRouter(),
  new UsersRouter(),
  new OfficeRouter(),
  new CashRouter(),
  new ClientRouter(),
  new AdversitementRouter(),
  new AutocompleteRouter(),
])

api.io.on('connection', socket => {
  console.log('socket connected succesefully')
})

api.listen()

/* async function seed() {
  await mongoose.connection.dropDatabase()

  seedDatabase()
}

seed()
 */
