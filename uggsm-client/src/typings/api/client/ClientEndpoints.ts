import { Endpoint } from '../Endpoint'

export type ClientEndpoints = {
  getAll: Endpoint
  getPaginated: Endpoint
  getByName: Endpoint
  getById: Endpoint
  create: Endpoint
  updateById: Endpoint
  deleteById: Endpoint
}
