import express from 'express'
import { AutocompleteController } from '../controllers'
import { IAutocompleteController, Router } from '../interfaces'
import { authenticationMiddleware } from '../middlewares'

export class AutocompleteRouter implements Router {
  public expressRouter: express.Router = express.Router()

  constructor() {
    const autocompleteController = new AutocompleteController()
    this.initializeRoutes(autocompleteController)
  }

  public initializeRoutes(controller: IAutocompleteController): void {
    const path = '/autocomplete'

    this.expressRouter
      .all(`${path}*`, authenticationMiddleware)
      .get(`${path}/customer-name`, controller.customerName)
      .get(`${path}/customer-phone`, controller.customerPhone)
      .get(`${path}/phone-brand`, controller.phoneBrand)
      .get(`${path}/phone-model`, controller.phoneModel)
      .get(`${path}/declared-defect`, controller.declaredDefect)
      .get(`${path}/appearance`, controller.appearance)
      .get(`${path}/kit`, controller.kit)
      .get(`${path}/master`, controller.master)
      .get(`${path}/manager`, controller.manager)
      .get(`${path}/completed-work`, controller.completedWork)
  }
}
