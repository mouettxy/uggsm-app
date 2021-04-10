import { ControllerMethod } from '../interfaces/controller'
import { ICallsController } from '../interfaces/ICallsController'
import { CallModel } from '../models/callModel'
import { BaseController } from '../base/Controller'
import { parsePaginationQuery } from '../helpers/pagination'

export class CallsController extends BaseController implements ICallsController {
  private model = CallModel

  public getPaginated: ControllerMethod = async (req, res, next) => {
    try {
      const { query, options } = parsePaginationQuery(req.body, this.model)

      // @ts-ignore
      const paginated = await this.model.paginate(query, { ...options, populate: 'relatedOrder' })

      this.success(res, paginated)
    } catch (error) {
      console.log(error)
      this.criticalError(next, error)
    }
  }
}
