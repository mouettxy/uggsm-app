import { parsePaginateResponse } from '../utils/helpers'
import { ControllerMethod } from '../interfaces/controller'
import { ICallsController } from '../interfaces/ICallsController'
import { OrderModel } from '../models'
import moment from 'moment'
import { DocumentType } from '@typegoose/typegoose'
import { api } from '../server'
import { Call, CallModel } from '../models/callModel'
import { Order } from '../models'
import { CallsWebhookCallStart, CallsWebhookCallAnswer, CallsWebhookCallFinish } from '../interfaces/CallsAPI'
import { formatPhone } from '../utils/helpers'
import BaseController from './base/BaseController'
import { logger } from 'express-winston'

export class CallsController extends BaseController implements ICallsController {
  private model = CallModel
  public getPaginated: ControllerMethod = async (req, res, next) => {
    const { query, options } = parsePaginateResponse(req.query, false, this.model)

    try {
      // @ts-ignore
      const response = await this.model.paginate(query, { ...options, populate: 'relatedOrder' })

      res.status(200)
      res.send(response)
    } catch (error) {
      console.log(error)
      this.criticalError(next)
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
            startTime: moment(body.event.start_time).toDate(),
            endTime: moment(body.event.end_time).toDate(),
            answerTime: moment(body.event.answer_time).toDate(),
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
            startTime: moment.utc(body.event.start_time).toDate(),
            endTime: moment.utc(body.event.end_time).toDate(),
            answerTime: moment.utc(body.event.answer_time).toDate(),
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
