import express from 'express'
import {
  IAdversitementController,
  IAuthentificationController,
  ICashController,
  IOfficeController,
  IOrdersController,
} from '.'
import { IAutocompleteController } from './IAutocompleteController'

export interface Router {
  expressRouter: express.Router
  initializeRoutes: (
    _:
      | IAdversitementController
      | IAuthentificationController
      | ICashController
      | IOfficeController
      | IOrdersController
      | IAutocompleteController,
  ) => void
}
