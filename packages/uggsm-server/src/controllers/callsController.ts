import { ControllerMethod } from '../interfaces/controller'
import { ICallsController } from '../interfaces/ICallsController'
import { OrderModel } from '../models'
import { DocumentType } from '@typegoose/typegoose'
import { api } from '../server'
import { Call, CallModel } from '../models/callModel'
import { Order } from '../models'
import { CallsWebhookCallStart, CallsWebhookCallAnswer, CallsWebhookCallFinish } from '../interfaces/CallsAPI'
import { formatPhone } from '../utils/helpers'
import BaseController from './base/BaseController'
import { parsePaginationQuery } from '../services/pagination'

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

  public callbackCallStart: ControllerMethod = async (req, res, next) => {
    const body: CallsWebhookCallStart = req.body

    this.success(res, body)
  }

  public callbackCallAnswer: ControllerMethod = async (req, res, next) => {
    const body: CallsWebhookCallAnswer = req.body

    this.success(res, body)
  }

  public callbackCallFinish: ControllerMethod = async (req, res, next) => {
    const body: CallsWebhookCallFinish = req.body
    // TODO: handle body.event.answer_time is 0

    // Группа Гаврилова Сервис
    if (body.event.user_group_id) {
      try {
        const customerPhone = formatPhone(body.event.client_number)

        const orders = await OrderModel.find({
          customerPhone,
          status: { $not: { $in: ['Закрыт', 'Выкуплен СЦ', 'Обещали найти', 'Закрыт с вопросом'] } },
        }).sort({ id: -1 })

        let order: DocumentType<Order> | undefined
        if (orders) {
          order = orders[0]
        }

        let call: DocumentType<Call>
        if (order) {
          // @ts-ignore
          call = await CallModel.create({
            relatedOrder: order._id,
            dbId: body.event.db_call_id as number,
            incoming: !!body.event.direction,
            answered: !!body.event.answered,
            clientNumber: customerPhone,
            managerNumber: formatPhone(body.event.src_number),
            manager: body.event.user_name,
            record: body.event.recording,
            startTime: new Date(body.event.start_time * 1000),
            endTime: new Date(body.event.end_time * 1000),
            answerTime: new Date(body.event.answer_time * 1000),
          })

          const workflowId = order.workflow.length + 1

          const workflow = {
            id: workflowId,
            message: `${call._id}`,
            username: '',
            header: call.incoming ? 'Исходящий звонок' : 'Входящий звонок',
          }

          order.statusCalls.push(call._id)
          order.workflow.push(workflow)

          await order.save()

          api.io.emit('added order call', order.id)
          api.io.emit('update order', order.id)
        } else {
          call = await CallModel.create({
            relatedOrder: null,
            dbId: body.event.db_call_id as number,
            incoming: !!body.event.direction,
            answered: !!body.event.answered,
            clientNumber: customerPhone,
            managerNumber: formatPhone(body.event.src_number),
            manager: body.event.user_name,
            record: body.event.recording,
            startTime: new Date(body.event.start_time * 1000),
            endTime: new Date(body.event.end_time * 1000),
            answerTime: new Date(body.event.answer_time * 1000),
          })
        }

        this.success(res)
      } catch (error) {
        this.criticalError(next, error)
      }
    } else {
      this.success(res, 'Invalid group id')
    }
  }
}
