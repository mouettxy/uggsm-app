import { ControllerMethod } from './controller'

export interface IOrdersController {
  getAll: ControllerMethod
  getAllByOffice: ControllerMethod
  getById: ControllerMethod
  addCompletedWork: ControllerMethod
  deleteCompletedWork: ControllerMethod
  addSms: ControllerMethod
  generateReport: ControllerMethod
  getAllWithParams: ControllerMethod
  addMasterComment: ControllerMethod
  addManagerComment: ControllerMethod
  addWorkflow: ControllerMethod
  setStatus: ControllerMethod
  setPayed: ControllerMethod
  setMaster: ControllerMethod
  setManager: ControllerMethod
  setOffice: ControllerMethod
  create: ControllerMethod
  createByOffice: ControllerMethod
  updateById: ControllerMethod
  deleteById: ControllerMethod
}
