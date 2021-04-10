import { map } from 'lodash'
import { MessageItem } from '../services/sms/RedSmsClient'
import { ControllerMethod } from '../interfaces/controller'
import { ICallbackController } from '../interfaces'
import { CallModel, OrderModel } from '../models'
import { BaseController } from '../base/Controller'
import { api } from '../server'
import { Call } from '../models/callModel'
import { Order } from '../models/orderModel'
import { DocumentType } from '@typegoose/typegoose'
import { CallsWebhookCallStart, CallsWebhookCallAnswer, CallsWebhookCallFinish } from '../interfaces/CallsAPI'
import { formatPhone } from '../utils/helpers'

export class CallbackController extends BaseController implements ICallbackController {
  private order = OrderModel

  private call = CallModel

  public smsCallback: ControllerMethod = async (req, res, next) => {
    try {
      const message: MessageItem = req.body

      let order = await this.order.findOne({
        statusSms: {
          $elemMatch: {
            uuid: message.uuid,
          },
        },
      })

      if (order) {
        order.statusSms = map(order.statusSms, (e) => {
          if (e.uuid === message.uuid) {
            return {
              ...e,
              sended: true,
            }
          }
        })

        order = await order.save()

        if (order) {
          api.io.emit('verified order sms', message, order.id)
          api.io.emit('update order', order.id)

          this.success(res, order)
        }
      }
    } catch (e) {
      this.criticalError(next, e.message)
    }
  }

  public callStartCallback: ControllerMethod = async (req, res, next) => {
    const body: CallsWebhookCallStart = req.body

    this.success(res, body)
  }

  public callAnswerCallback: ControllerMethod = async (req, res, next) => {
    const body: CallsWebhookCallAnswer = req.body

    this.success(res, body)
  }

  public callFinishCallback: ControllerMethod = async (req, res, next) => {
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
          call = await this.call.create({
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
          call = await this.call.create({
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
