import { ControllerMethod } from './controller'

export type IOrdersController = {
  getById: ControllerMethod
  addCompletedWork: ControllerMethod
  deleteCompletedWork: ControllerMethod
  setEstimatedCloseAt: ControllerMethod
  addSms: ControllerMethod
  generateReport: ControllerMethod
  addUsedDetail: ControllerMethod
  addMasterComment: ControllerMethod
  addManagerComment: ControllerMethod
  setStatus: ControllerMethod
  setPayed: ControllerMethod
  setMaster: ControllerMethod
  setManager: ControllerMethod
  setOffice: ControllerMethod
  createByOffice: ControllerMethod
  updateById: ControllerMethod
  deleteById: ControllerMethod
  getPaginated: ControllerMethod
}
