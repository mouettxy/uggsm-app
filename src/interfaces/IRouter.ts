import express from 'express'
import {
  IAdversitementController,
  IAuthentificationController,
  ICashController,
  IOfficeController,
  IOrdersController,
} from '.'

export interface Router {
  expressRouter: express.Router
  initializeRoutes: (
    _: IAdversitementController | IAuthentificationController | ICashController | IOfficeController | IOrdersController,
  ) => void
}
