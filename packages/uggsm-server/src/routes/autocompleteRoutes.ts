import { AutocompleteController } from '../controllers'
import { IAutocompleteController } from '../interfaces'
import BaseRouter from './heplers/BaseRouter'

export class AutocompleteRouter extends BaseRouter<IAutocompleteController> {
  constructor() {
    super(AutocompleteController, '/autocomplete', false)
  }

  initializeRoutes() {
    this.expressRouter
      .get(this.prefixed('customer-name'), this.controller.customerName)
      .get(this.prefixed('customer-phone'), this.controller.customerPhone)
      .get(this.prefixed('phone-brand'), this.controller.phoneBrand)
      .get(this.prefixed('phone-model'), this.controller.phoneModel)
      .get(this.prefixed('declared-defect'), this.controller.declaredDefect)
      .get(this.prefixed('appearance'), this.controller.appearance)
      .get(this.prefixed('kit'), this.controller.kit)
      .get(this.prefixed('users'), this.controller.users)
      .get(this.prefixed('master'), this.controller.master)
      .get(this.prefixed('manager'), this.controller.manager)
      .get(this.prefixed('completed-work'), this.controller.completedWork)
  }
}
