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

const Routers = {
  authentification: new AuthenticationRouter(),
  orders: new OrdersRouter(),
  users: new UsersRouter(),
  office: new OfficeRouter(),
  cash: new CashRouter(),
  client: new ClientRouter(),
  adversitement: new AdversitementRouter(),
  autocomplete: new AutocompleteRouter(),
  emailSubscription: new EmailSubscriptionRouter(),
  calls: new CallsRouter(),
  roles: new RolesRouter(),
}

export const api = new RestApi<typeof Routers>(Routers)

api.io.on('connection', () => {
  //
})

api.listen()
