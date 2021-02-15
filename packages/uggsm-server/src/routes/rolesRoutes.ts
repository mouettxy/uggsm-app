import { IRolesController } from '../interfaces'
import { RolesController } from '../controllers'
import BaseRouter from './heplers/BaseRouter'

export class RolesRouter extends BaseRouter<IRolesController> {
  constructor() {
    super(RolesController, '/role', true)
  }

  initializeRoutes() {
    this.expressRouter
      .get(this.prefixed(''), this.controller.get)

      .post(this.prefixed(''), this.controller.create)
      .get(this.prefixed(':name'), this.controller.getByName)
      .put(this.prefixed(':name'), this.controller.update)
      .delete(this.prefixed(':name'), this.controller.delete)

      .post(this.prefixed(':name/resource'), this.controller.createResource)
      .delete(this.prefixed(':name/resource'), this.controller.deleteResource)

      .post(this.prefixed(':name/ability'), this.controller.createAbility)
      .put(this.prefixed(':name/ability'), this.controller.updateAbility)
      .delete(this.prefixed(':name/ability'), this.controller.deleteAbility)

      .post(this.prefixed(':role/resource/:resource/ability/:ability/field/:field'), this.controller.createField)
      .put(this.prefixed(':role/resource/:resource/ability/:ability/field/:field'), this.controller.updateField)
      .delete(this.prefixed(':role/resource/:resource/ability/:ability/field/:field'), this.controller.deleteField)
  }
}
