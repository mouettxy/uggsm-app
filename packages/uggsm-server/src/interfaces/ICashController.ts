import { ControllerMethod } from './controller'

export type ICashController = {
  getAll: ControllerMethod
  getAllByOffice: ControllerMethod
  getPaginated: ControllerMethod
  getBalance: ControllerMethod
  getByOrder: ControllerMethod
  getTotalByFilter: ControllerMethod
  getById: ControllerMethod
  createByOffice: ControllerMethod
  updateById: ControllerMethod
  deleteById: ControllerMethod
}
