import { ControllerMethod } from './controller'

export interface IAutocompleteController {
  customerName: ControllerMethod
  customerPhone: ControllerMethod
  phoneBrand: ControllerMethod
  phoneModel: ControllerMethod
  declaredDefect: ControllerMethod
  appearance: ControllerMethod
  kit: ControllerMethod
  master: ControllerMethod
  users: ControllerMethod
  manager: ControllerMethod
  completedWork: ControllerMethod
}
