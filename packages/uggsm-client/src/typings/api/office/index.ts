import { Endpoint } from '../Endpoint'

export type Office = {
  _id: string
  code: string
  name: string
  address: string
  ordersTemplate: string
  docsTemplate: string
}

export type OfficeEndpoints = {
  getAll: Endpoint
  getByCode: Endpoint
  create: Endpoint
  update: Endpoint
  delete: Endpoint
}
