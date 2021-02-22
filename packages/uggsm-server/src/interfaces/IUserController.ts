import { ControllerMethod } from './controller'

export type IUserController = {
  get: ControllerMethod
  getOne: ControllerMethod
  delete: ControllerMethod
  update: ControllerMethod
}
