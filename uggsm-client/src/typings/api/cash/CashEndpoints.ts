import { Endpoint } from '../Endpoint'

export type CashEndpoints = {
  getAll: Endpoint
  getAllByOffice: Endpoint
  getBalance: Endpoint
  getPaginated: Endpoint
  getByOrder: Endpoint
  createByOffice: Endpoint
  updateById: Endpoint
  deleteById: Endpoint
}
