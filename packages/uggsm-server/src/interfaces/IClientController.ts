import { ControllerMethod } from './controller'

export interface IClientController {
  getAll: ControllerMethod
  getById: ControllerMethod
  getPaginated: ControllerMethod
  getByName: ControllerMethod
  getByCode: ControllerMethod
  create: ControllerMethod
  updateById: ControllerMethod
  deleteById: ControllerMethod
}
