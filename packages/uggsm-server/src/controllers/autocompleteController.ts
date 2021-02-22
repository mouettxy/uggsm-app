import { ExtendedRouter } from './../routes/heplers/BaseRouter'
import { ControllerMethod } from './../interfaces/controller'
import { BaseController } from './base/BaseController'
import { filter, isString, map, reduce } from 'lodash'
import { IAutocompleteController } from '../interfaces'
import { ClientModel, OfficeModel, OrderModel, RoleModel, UserModel } from '../models'
import { api } from '../server'

export class AutocompleteController extends BaseController implements IAutocompleteController {
  private user = UserModel
  private order = OrderModel
  private client = ClientModel
  private office = OfficeModel
  private role = RoleModel

  private _normalizeQuery = (query: string) => {
    if (!isString(query)) {
      return ''
    }

    return query
  }

  public customerName: ControllerMethod = async (req, res, next) => {
    const search = this._normalizeQuery(req.query.search as string)

    try {
      const response = await this.client
        .find({ name: new RegExp(search, 'i') })
        .select('name')
        .limit(10)
        .lean()

      const reduced = reduce(
        response,
        (a, e) => {
          a.push({ text: e.name, value: e.name })
          return a
        },
        []
      )

      this.success(res, reduced)
    } catch (error) {
      this.badRequest(next, 'Нет данных для поиска')
    }
  }

  public customerPhone: ControllerMethod = async (req, res, next) => {
    const search = this._normalizeQuery(req.query.search as string)

    try {
      const response = await this.client.findOne({ name: search })

      const reduced = reduce(
        response.phone,
        (a, e) => {
          a.push({ text: e.phone, value: e.phone })
          return a
        },
        []
      )

      this.success(res, reduced)
    } catch (error) {
      this.badRequest(next, 'Нет данных для поиска')
    }
  }

  public phoneBrand: ControllerMethod = async (req, res, next) => {
    const search = this._normalizeQuery(req.query.search as string)

    try {
      const response = await this.order
        .aggregate([
          { $match: { phoneBrand: new RegExp(search, 'i') } },
          { $group: { _id: '$phoneBrand' } },
          { $sample: { size: 10 } },
        ])
        .limit(10)

      const reduced = reduce(
        response,
        (a, e) => {
          a.push({ text: e._id, value: e._id })

          return a
        },
        []
      )

      this.success(res, reduced)
    } catch (error) {
      this.badRequest(next, 'Нет данных для поиска')
    }
  }

  public phoneModel: ControllerMethod = async (req, res, next) => {
    const search = this._normalizeQuery(req.query.search as string)

    try {
      const response = await this.order.aggregate([
        { $match: { phoneModel: new RegExp(search, 'i') } },
        { $group: { _id: '$phoneModel' } },
        { $sample: { size: 10 } },
      ])
      const reduced = reduce(
        response,
        (a, e) => {
          a.push({ text: e._id, value: e._id })

          return a
        },
        []
      )

      this.success(res, reduced)
    } catch (error) {
      this.badRequest(next, 'Нет данных для поиска')
    }
  }

  public declaredDefect: ControllerMethod = async (req, res, next) => {
    const search = this._normalizeQuery(req.query.search as string)

    try {
      const response = await this.order
        .aggregate([
          { $match: { declaredDefect: new RegExp(search, 'i') } },
          { $group: { _id: '$declaredDefect' } },
          { $sample: { size: 10 } },
        ])
        .limit(10)

      const reduced = reduce(
        response,
        (a, e) => {
          a.push({ text: e._id, value: e._id })

          return a
        },
        []
      )

      this.success(res, reduced)
    } catch (error) {
      this.badRequest(next, 'Нет данных для поиска')
    }
  }

  public appearance: ControllerMethod = async (req, res, next) => {
    const search = this._normalizeQuery(req.query.search as string)

    try {
      const response = await this.order
        .aggregate([
          { $match: { appearance: new RegExp(search, 'i') } },
          { $group: { _id: '$appearance' } },
          { $sample: { size: 10 } },
        ])
        .limit(10)

      const reduced = reduce(
        response,
        (a, e) => {
          a.push({ text: e._id, value: e._id })

          return a
        },
        []
      )

      this.success(res, reduced)
    } catch (error) {
      this.badRequest(next, 'Нет данных для поиска')
    }
  }

  public kit: ControllerMethod = async (req, res, next) => {
    const search = this._normalizeQuery(req.query.search as string)

    try {
      const response = await this.order
        .aggregate([
          { $match: { kit: new RegExp(search, 'i') } },
          { $group: { _id: '$kit' } },
          { $sample: { size: 10 } },
        ])
        .limit(10)

      const reduced = reduce(
        response,
        (a, e) => {
          a.push({ text: e._id, value: e._id })

          return a
        },
        []
      )

      this.success(res, reduced)
    } catch (error) {
      this.badRequest(next, 'Нет данных для поиска')
    }
  }

  public completedWork: ControllerMethod = async (req, res, next) => {
    const search = this._normalizeQuery(req.query.search as string)

    try {
      const response = await this.order.aggregate([
        { $unwind: '$statusWork' },
        { $match: { 'statusWork.header': new RegExp(search, 'i') } },
        {
          $group: {
            _id: { header: '$statusWork.header', price: '$statusWork.price', message: '$statusWork.message' },
          },
        },
        { $sample: { size: 10 } },
      ])

      const reduced = reduce(
        // @ts-ignore
        response,
        (a, e) => {
          a.push({ text: e._id.header, value: e._id })

          return a
        },
        []
      )

      this.success(res, reduced)
    } catch (error) {
      this.badRequest(next, 'Нет данных для поиска')
    }
  }

  public users: ControllerMethod = async (req, res, next) => {
    const returnValue = req.query['return-value'] as string
    const search = this._normalizeQuery(req.query.search as string)

    try {
      const response = await this.user.find({ credentials: new RegExp(search, 'i') }).lean()

      const returns: string = returnValue ? returnValue : '_id'

      const reduced = reduce(
        response,
        (a, e) => {
          a.push({ text: e.credentials, value: e[returns] })

          return a
        },
        []
      )

      this.success(res, reduced)
    } catch (error) {
      this.badRequest(next, 'Нет данных для поиска')
    }
  }

  // FIXME: in backend and frontend used as all roles
  public master: ControllerMethod = async (req, res, next) => {
    const search = this._normalizeQuery(req.query.search as string)

    try {
      const response = await this.user
        .find({ credentials: new RegExp(search, 'i'), role: { $in: ['master', 'manager', 'administrator'] } })
        .select('_id credentials')
        .lean()

      const reduced = reduce(
        response,
        (a, e) => {
          a.push({ text: e.credentials, value: e._id })

          return a
        },
        []
      )

      this.success(res, reduced)
    } catch (error) {
      this.badRequest(next, 'Нет данных для поиска')
    }
  }

  public manager: ControllerMethod = async (req, res, next) => {
    const search = this._normalizeQuery(req.query.search as string)

    try {
      const response = await this.user
        .find({ credentials: new RegExp(search, 'i'), role: { $in: ['manager', 'administrator'] } })
        .select('_id credentials')
        .lean()

      const reduced = reduce(
        response,
        (a, e) => {
          a.push({ text: e.credentials, value: e._id })

          return a
        },
        []
      )

      this.success(res, reduced)
    } catch (error) {
      this.badRequest(next, 'Нет данных для поиска')
    }
  }

  public offices: ControllerMethod = async (req, res, next) => {
    const search = this._normalizeQuery(req.query.search as string)

    try {
      const response = await this.office
        .find({
          $or: [{ name: new RegExp(search, 'i') }, { code: new RegExp(search, 'i') }],
        })
        .select('name')
        .lean()

      const reduced = reduce(
        response,
        (a, e) => {
          a.push({ text: e.name, value: e.name })

          return a
        },
        []
      )

      this.success(res, reduced)
    } catch (error) {
      this.badRequest(next, 'Нет данных для поиска')
    }
  }

  public roles: ControllerMethod = async (req, res, next) => {
    const search = this._normalizeQuery(req.query.search as string)

    const regExp = new RegExp(search, 'i')

    try {
      const response = await this.role
        .find({ $or: [{ name: regExp }, { value: regExp }, { description: regExp }] })
        .select(['name', 'value'])
        .lean()

      const reduced = reduce(
        response,
        (a, e) => {
          a.push({ text: e.name, value: e.value })

          return a
        },
        []
      )

      this.success(res, reduced)
    } catch (error) {
      this.badRequest(next, 'Нет данных для поиска')
    }
  }

  public listOfRoutes: ControllerMethod = async (req, res, next) => {
    const search = this._normalizeQuery(req.query.search as string)

    try {
      const routes = map((api.routers.autocomplete as ExtendedRouter<any>).routes, (e) => ({
        text: e.description,
        value: e.path,
      }))

      const searchRegExp = new RegExp(search, 'i')

      this.success(
        res,
        filter(routes, (e) => searchRegExp.test(e.text) || searchRegExp.test(e.value))
      )
    } catch (error) {
      this.badRequest(next, 'Нет данных для поиска')
    }
  }
}
