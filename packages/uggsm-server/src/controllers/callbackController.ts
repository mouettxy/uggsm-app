import { map } from 'lodash'
import { MessageItem } from '../services/sms/RedSmsClient'
import { ControllerMethod } from '../interfaces/controller'
import { ICallbackController } from '../interfaces'
import { OrderModel } from '../models'
import BaseController from './base/BaseController'
import { api } from '../server'

export class CallbackController extends BaseController implements ICallbackController {
  private order = OrderModel

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
}
