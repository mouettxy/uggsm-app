import { IExtendedRouter, ExtendedRouterRouteEntry } from './../../interfaces/IRouter'
import express from 'express'
import { authenticationMiddleware } from '../../middlewares'
import { each } from 'lodash'
export class ExtendedRouter<T> implements IExtendedRouter<T> {
  private setAuthMiddleware = true

  public routes: ExtendedRouterRouteEntry<T>[] = []

  public expressRouter: express.Router = express.Router()

  public basePath = ''

  public controller: T | null = null

  constructor(Controller: new () => T | null, basePath: string, setAuth = true) {
    if (Controller) {
      this.basePath = basePath
      this.controller = new Controller()
      this.setAuthMiddleware = setAuth

      if (this.setAuthMiddleware) {
        this.expressRouter.all(`${this.basePath}*`, authenticationMiddleware)
      }

      this.defineRoutes()

      this.build()
    } else {
      throw new Error('Controller or base path is not specified')
    }
  }

  addRoute(route: ExtendedRouterRouteEntry<T>) {
    this.routes.push(route)
  }

  addRoutes(routes: ExtendedRouterRouteEntry<T>[]) {
    each(routes, (e) => {
      this.routes.push(e)
    })
  }

  defineRoutes() {
    throw new Error('Routes not specified')
  }

  build() {
    if (this.routes.length > 0) {
      each(this.routes, (e) => {
        const routeArgs: Array<any> = [`${this.basePath}/${e.path}`]

        if (e.validators) {
          each(e.validators, (validator) => routeArgs.push(validator))
        }

        routeArgs.push(this.controller[e.controllerMethod])

        //FIXME: tsignore
        //@ts-ignore
        this.expressRouter[e.method](...routeArgs)
      })
    }
  }
}
