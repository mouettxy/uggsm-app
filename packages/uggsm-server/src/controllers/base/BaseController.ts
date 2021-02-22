import { NextFunction, Response } from 'express'
import { HttpException } from '../../exceptions'

export class BaseController {
  parsePaginateRequest = (
    requestQuery,
    model = undefined,
    modifyQueryFn?: (query: any) => any,
    modifyOptionsFn?: (options: any) => any
  ) => {
    let query: any = {}

    const page = requestQuery.page
    const limit = requestQuery.limit
    let options: any = {
      page,
      limit,
    }

    if (requestQuery.sort) {
      try {
        options.sort = JSON.parse(`${requestQuery.sort}`)
      } catch (e) {
        // do nothing
      }
    }

    if (requestQuery.search) {
      if (model) {
        const searchQuery = model.searchBuilder(requestQuery.search)
        if (parseInt(requestQuery.search)) {
          searchQuery.$and[0].$or.push({
            id: { $gte: requestQuery.search, $lte: requestQuery.search },
          })

          searchQuery.$and[0].$or.push({
            warrantyOrderId: { $gte: requestQuery.search, $lte: requestQuery.search },
          })
        }
        query = {
          ...query,
          ...searchQuery,
        }
      }
    }

    if (requestQuery.filter) {
      const filter = JSON.parse(requestQuery.filter as string)
      const newFilter = {}
      for (const k in filter) {
        if (filter[k]) {
          if (parseInt(filter[k])) {
            newFilter[k] = { $gte: filter[k] }
          } else {
            newFilter[k] = { $regex: new RegExp(filter[k], 'i') }
          }
        }
      }
      Object.assign(query, newFilter)
    }

    if (modifyQueryFn && typeof modifyQueryFn === 'function') {
      query = modifyQueryFn(query)
    }

    if (modifyOptionsFn && typeof modifyOptionsFn === 'function') {
      options = modifyOptionsFn(options)
    }

    return {
      query,
      options,
    }
  }

  public success(res: Response, data: any = '') {
    res.status(200).send(data)
  }

  public badRequest(next: NextFunction, message = 'Невалидные данные') {
    next(new HttpException(400, message))
  }

  public criticalError(next: NextFunction, message = 'Ошибка сервера') {
    next(new HttpException(500, message))
  }
}

export default BaseController
