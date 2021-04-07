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
      | IAutocompleteController
  ) => void
}

export type ExtendedRouterRouteEntry<T> = {
  path: string
  description: string
  controllerMethod: keyof T
  method: 'get' | 'post' | 'put' | 'delete'
  validators?: Array<any>
}

export interface IExtendedRouter<T> {
  expressRouter: express.Router
  basePath: string
  controller: T | null
  routes: ExtendedRouterRouteEntry<T>[]

  addRoute: (route: ExtendedRouterRouteEntry<T>) => void
  addRoutes: (routes: ExtendedRouterRouteEntry<T>[]) => void
  defineRoutes: () => void
  build: () => void
}
