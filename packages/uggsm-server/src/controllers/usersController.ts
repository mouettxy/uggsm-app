import { IUserController } from './../interfaces/IUserController'
import { UserModel } from './../models/userModel'
import { ControllerMethod } from '../interfaces/controller'
import { api } from '../server'
import { BaseController } from '../base/Controller'
import { parsePaginationQuery } from '../services/pagination'

enum Emits {
  USER_UPDATED = 'user updated',
  USER_DELETED = 'user deleted',
  USER_CREATED = 'user created',

  USERS_UPDATED = 'users updated',
}

export class UsersController extends BaseController implements IUserController {
  private model = UserModel

  private Emits = Emits

  public get: ControllerMethod = async (req, res, next) => {
    try {
      const documents = await this.model.find().select(['-password', '-tokens'])

      this.success(res, documents)
    } catch (error) {
      this.criticalError(next, error)
    }
  }

  public getPaginated: ControllerMethod = async (req, res, next) => {
    try {
      const { query, options } = parsePaginationQuery(req.body, this.model)

      // @ts-ignore
      const paginated = await this.model.paginate(query, options)

      this.success(res, paginated)
    } catch (error) {
      this.criticalError(next, error)
    }
  }

  public getOne: ControllerMethod = async (req, res, next) => {
    const id = req.params.id

    try {
      const document = await this.model.findById(id).select(['-password', '-tokens'])

      this.success(res, document)
    } catch (error) {
      this.criticalError(next, error)
    }
  }

  public update: ControllerMethod = async (req, res, next) => {
    const id = req.params.id

    const fields = req.body

    try {
      const document = await this.model.findByIdAndUpdate(id, fields, { new: true })

      api.io.emit(this.Emits.USER_UPDATED, document)
      api.io.emit(this.Emits.USERS_UPDATED, id)

      this.success(res, document)
    } catch (error) {
      this.criticalError(next, error)
    }
  }

  public delete: ControllerMethod = async (req, res, next) => {
    const id = req.params.id

    try {
      const document = await this.model.findByIdAndDelete(id)

      api.io.emit(this.Emits.USER_DELETED, id)
      api.io.emit(this.Emits.USERS_UPDATED, id)

      this.success(res, document)
    } catch (error) {
      this.criticalError(next, error)
    }
  }
}
