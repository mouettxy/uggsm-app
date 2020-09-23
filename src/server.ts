import 'reflect-metadata'
import RestApi from './RestApi'
import {
  AuthenticationRouter,
  OrdersRouter,
  UsersRouter,
  OfficeRouter,
} from './routes'
import { validateEnv } from './utils'

validateEnv()

const api = new RestApi([
  new AuthenticationRouter(),
  new OrdersRouter(),
  new UsersRouter(),
  new OfficeRouter(),
])

api.listen()
