import { Endpoint } from '../Endpoint'

export type CashEndpoints = {
  getAll: Endpoint
  getById: Endpoint
  create: Endpoint
  updateById: Endpoint
  deleteById: Endpoint
}
