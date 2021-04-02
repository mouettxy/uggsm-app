import { ControllerMethod } from './controller'

export type IOrdersController = {
  getAll: ControllerMethod
  getAllByOffice: ControllerMethod
  getById: ControllerMethod
  smsCallback: ControllerMethod
  addCompletedWork: ControllerMethod
  deleteCompletedWork: ControllerMethod
  setEstimatedCloseAt: ControllerMethod
  addSms: ControllerMethod
  generateReport: ControllerMethod
  addUsedDetail: ControllerMethod
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
  getPaginated: ControllerMethod
}
