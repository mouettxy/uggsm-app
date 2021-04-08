import { ControllerMethod } from './controller'

export type ICashController = {
  getPaginated: ControllerMethod
  getByOrder: ControllerMethod
  getById: ControllerMethod
  createByOffice: ControllerMethod
  updateById: ControllerMethod
  deleteById: ControllerMethod
}
