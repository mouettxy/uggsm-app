import 'reflect-metadata'
import RestApi from './RestApi'
import {
  AuthenticationRouter,
  OrdersRouter,
  UsersRouter,
  OfficeRouter,
  CashRouter,
  AdversitementRouter,
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
])

api.listen()
