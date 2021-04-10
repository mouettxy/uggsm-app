import { Router } from '../base/Router'
import { ControllerMethod } from './../interfaces/controller'
import { BaseController } from '../base/Controller'
import { compact, filter, flatten, isString, lowerCase, map, reduce } from 'lodash'
import { IAutocompleteController } from '../interfaces'
import { ClientModel, OfficeModel, OrderModel, RoleModel, UserModel } from '../models'
import { api } from '../server'
import { mongoose } from '@typegoose/typegoose'
import util from 'util'

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

  public customAutocomplete: ControllerMethod = async (req, res, next) => {
    const autocompleteInformation: {
      query: string
      model: string
      field: string
      value: string
      match: string
      type: string
    } = {
      query: (req.query.q || '') as string,
      model: (req.query.m || '') as string,
      field: (req.query.f || '') as string,
      value: (req.query.v || '') as string,
      match: (req.query.match || '') as string,
      type: (req.query.t || '') as string,
    }

    const getLookupFields = ({ field, value }: { field: string; value: string }) => {
      const lookupFields = []
      const fieldSplit = field.split('.')
      const valueSplit = value.split('.')

      if (fieldSplit.length > 1) {
        const lookupField = fieldSplit[0]
        lookupFields.push(lookupField)
      }

      if (valueSplit.length > 1) {
        const lookupField = valueSplit[0]
        lookupFields.push(lookupField)
      }

      return lookupFields
    }

    const getModelLookup = (model: string, fields: Array<string>) => {
      const skip = ['Adversitement']
      const schema = Object.entries(mongoose.model(model).schema.obj)

      const refList = filter(schema, (e) => (e[1] as any)?.autopopulate)

      // in e[0] we have name of field
      const toBePopulated = filter(refList, (e) => fields.includes(e[0]))

      return flatten(
        compact(
          map(toBePopulated, (e) => {
            if (!skip.includes(e[1].ref)) {
              const from = lowerCase(e[1].ref) + 's'
              const localField = e[0]

              return [
                {
                  $lookup: {
                    from,
                    localField,
                    foreignField: '_id',
                    as: localField,
                  },
                },
                {
                  $unwind: {
                    path: '$' + localField,
                  },
                },
              ]
            }
          })
        )
      )
    }

    const makeAggregation = (autocompleteInformation: {
      query: string
      model: string
      field: string
      value: string
      match: string
      type: string
    }) => {
      const lookupPart = getModelLookup(
        autocompleteInformation.model,
        getLookupFields({
          field: autocompleteInformation.field,
          value: autocompleteInformation.value,
        })
      )
      const matchPart = [
        {
          $match: {
            [autocompleteInformation.field]: new RegExp(autocompleteInformation.query || '', 'i') || '',
            ...getCustomMatch(autocompleteInformation.match),
          },
        },
        {
          $group: {
            _id: {
              text: '$' + autocompleteInformation.field,
              value: '$' + autocompleteInformation.value,
            },
          },
        },
        {
          $project: {
            _id: 0,
            text: '$_id.text',
            value: '$_id.value',
          },
        },
        {
          $limit: 20,
        },
      ]

      if (autocompleteInformation.type === 'array') {
        return [
          ...lookupPart,
          {
            $unwind: `$${autocompleteInformation.field.split('.')[0]}`,
          },
          ...matchPart,
        ]
      }

      return [...lookupPart, ...matchPart]
    }

    const getCustomMatch = (match) => {
      if (!match) {
        return {}
      }

      const splitted = match.split(':')

      return { [splitted[0]]: splitted[1] }
    }

    if (!autocompleteInformation.model || !autocompleteInformation.field) {
      this.badRequest(next, 'Не указан один из необходимых параметров')
      return
    }

    if (!mongoose.modelNames().includes(autocompleteInformation.model)) {
      this.badRequest(next, 'Неверно указана модель')
      return
    }

    if (!autocompleteInformation.value) {
      autocompleteInformation.value = autocompleteInformation.field
    }

    const aggregation = makeAggregation(autocompleteInformation)

    console.log(util.inspect(aggregation, false, null, true /* enable colors */))
    const data = await mongoose.model(autocompleteInformation.model).aggregate(aggregation)

    this.success(res, data)
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
        .find({ credentials: new RegExp(search, 'i') })
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
        .find({ credentials: new RegExp(search, 'i') })
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
      const routes = map((api.routers.autocomplete as Router<any>).routes, (e) => ({
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
