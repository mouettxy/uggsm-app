import express, { Router as ExpressRouter } from 'express'
import { authenticationMiddleware } from '../middlewares'
import { each } from 'lodash'

export type RouteEntry<T> = {
  path: string
  description: string
  controllerMethod: keyof T
  method: 'get' | 'post' | 'put' | 'delete'
  validators?: Array<any>
}

export interface RouterInterface<T> {
  expressRouter: ExpressRouter
  basePath: string
  controller: T | null
  routes: RouteEntry<T>[]

  addRoute: (route: RouteEntry<T>) => void
  addRoutes: (routes: RouteEntry<T>[]) => void
  defineRoutes: () => void
  build: () => void
}

export const AUTH_MIDDLEWARE = {
  ENABLE: true,
  DISABLE: false,
}

export class Router<T> implements RouterInterface<T> {
  private setAuthMiddleware = true

  public routes: RouteEntry<T>[] = []

  public expressRouter: ExpressRouter = express.Router()

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

  addRoute(route: RouteEntry<T>) {
    this.routes.push(route)
  }

  addRoutes(routes: RouteEntry<T>[]) {
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

export default Router
