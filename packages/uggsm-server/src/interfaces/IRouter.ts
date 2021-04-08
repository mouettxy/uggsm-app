import { Router } from 'express'

export type ExtendedRouterRouteEntry<T> = {
  path: string
  description: string
  controllerMethod: keyof T
  method: 'get' | 'post' | 'put' | 'delete'
  validators?: Array<any>
}

export interface IExtendedRouter<T> {
  expressRouter: Router
  basePath: string
  controller: T | null
  routes: ExtendedRouterRouteEntry<T>[]

  addRoute: (route: ExtendedRouterRouteEntry<T>) => void
  addRoutes: (routes: ExtendedRouterRouteEntry<T>[]) => void
  defineRoutes: () => void
  build: () => void
}
