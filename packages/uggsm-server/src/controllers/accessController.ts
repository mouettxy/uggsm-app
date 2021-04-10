import { ControllerMethod } from '../interfaces'
import { BaseController } from '../base'
import { AccessService, accessServiceEmits } from '../services'
import { parsePaginationQuery } from '../helpers/pagination'

export interface AccessControllerInterface {
  getPaginated: ControllerMethod
  getAll: ControllerMethod
  getOne: ControllerMethod
  create: ControllerMethod
  update: ControllerMethod
  delete: ControllerMethod
}

export class AccessController extends BaseController implements AccessControllerInterface {
  private service = new AccessService()

  private emitsOn = accessServiceEmits

  public getPaginated: ControllerMethod = async (req, res, next) => {
    try {
      const { query, options } = parsePaginationQuery(req.body, this.service.model)

      const response = await this.service.getPaginated(query, options)

      this.success(res, response)
    } catch (error) {
      this.criticalError(next, error)
    }
  }

  public getAll: ControllerMethod = async (req, res, next) => {
    try {
      const response = await this.service.getAll()

      this.success(res, response)
    } catch (error) {
      this.criticalError(next, error)
    }
  }

  public getOne: ControllerMethod = async (req, res, next) => {
    try {
      const response = await this.service.getOne({ _id: req.params.id })

      this.success(res, response)
    } catch (error) {
      this.criticalError(next, error)
    }
  }

  public create: ControllerMethod = async (req, res, next) => {
    try {
      const response = await this.service.create({ ...req.body })

      this.emitsOn.updatedAll()
      this.success(res, response)
    } catch (error) {
      this.criticalError(next, error)
    }
  }

  public update: ControllerMethod = async (req, res, next) => {
    try {
      const response = await this.service.update({ _id: req.params.id }, { ...req.body })

      this.emitsOn.updatedAll()
      this.success(res, response)
    } catch (error) {
      this.criticalError(next, error)
    }
  }

  public delete: ControllerMethod = async (req, res, next) => {
    try {
      const response = await this.service.delete({ _id: req.params.id })

      this.emitsOn.updatedAll()
      this.success(res, response)
    } catch (error) {
      this.criticalError(next, error)
    }
  }
}
