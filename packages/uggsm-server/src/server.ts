import 'reflect-metadata'
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
  CallsRouter,
  RolesRouter,
} from './routes'
import { ClientRouter } from './routes/clientRoutes'
import { validateEnv } from './utils'
import './services/jobs'
import './services/logger'

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
  new CallsRouter(),
  new RolesRouter(),
])

api.io.on('connection', () => {
  //
})

api.listen()
