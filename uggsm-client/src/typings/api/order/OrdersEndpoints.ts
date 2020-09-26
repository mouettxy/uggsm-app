import { Endpoint } from '../Endpoint'

export type OrdersEndpoints = {
  getAll: Endpoint
  getAllByOffice: Endpoint
  getById: Endpoint
  create: Endpoint
  createByOffice: Endpoint
  addSms: Endpoint
  addCompletedWork: Endpoint
  addMasterComment: Endpoint
  addManagerComment: Endpoint
  addWorkflow: Endpoint
  setStatus: Endpoint
  setPayed: Endpoint
  setMaster: Endpoint
  setManager: Endpoint
  setOffice: Endpoint
  updateById: Endpoint
  deleteById: Endpoint
}
