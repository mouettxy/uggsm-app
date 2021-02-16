import { ControllerMethod } from './controller'

export type IRolesController = {
  get: ControllerMethod
  getOne: ControllerMethod
  create: ControllerMethod
  delete: ControllerMethod
  update: ControllerMethod

  createAbility: ControllerMethod
  updateAbility: ControllerMethod
  deleteAbility: ControllerMethod
}
