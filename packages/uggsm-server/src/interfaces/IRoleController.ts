import { ControllerMethod } from './controller'

export type IRolesController = {
  get: ControllerMethod
  getByName: ControllerMethod
  create: ControllerMethod
  delete: ControllerMethod
  update: ControllerMethod
  createResource: ControllerMethod
  deleteResource: ControllerMethod
  createAbility: ControllerMethod
  deleteAbility: ControllerMethod
  updateAbility: ControllerMethod
  createField: ControllerMethod
  updateField: ControllerMethod
  deleteField: ControllerMethod
}
