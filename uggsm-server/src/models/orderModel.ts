import { Office, OfficeModel, UserModel } from '.'
import { pre, plugin, getModelForClass, prop, Ref, ReturnModelType } from '@typegoose/typegoose'
import autopopulate from 'mongoose-autopopulate'
import { AutoIncrement } from '../utils'
import { filter, isEmpty } from 'lodash'
import { Client, ClientModel } from './clientModel'
import { processWorkflowData, extendArrayWithId } from '../utils/helpers'

const statuses = ['Новый', 'На уточнении', 'В работе', 'Готов']

export class CompletedWork {
  @prop()
  public id: number

  @prop()
  public userid: number

  @prop()
  public username: string

  @prop()
  public header: string

  @prop()
  public message: string

  @prop()
  public price: string
}

export class SmsMessage {
  @prop()
  public id: number

  @prop()
  public userid: number

  @prop()
  public username: string

  @prop()
  public header: string

  @prop()
  public message: string

  @prop({ default: false })
  public sended: boolean

  @prop({ default: new Date() })
  public date: Date
}

export class Comment {
  @prop()
  public id: number

  @prop()
  public userid: number

  @prop()
  public username: string

  @prop()
  public header: string

  @prop()
  public message: string

  @prop({ default: new Date() })
  public date: Date
}

export class Workflow {
  @prop()
  public id: number

  @prop()
  public message: string

  @prop()
  public username: string

  @prop()
  public header: string

  @prop()
  public userid?: number

  @prop({ default: new Date() })
  public date?: Date
}

@pre<Order>('save', async function() {
  if (!this.status) {
    this.status = 'Новый'
    this.workflow.push(
      extendArrayWithId(this.workflow, {
        message: `Установлен статус ${this.status}`,
      }),
    )
  } else {
    if (this.modifiedPaths().includes('status')) {
      this.workflow.push(
        extendArrayWithId(this.workflow, {
          message: `Установлен статус ${this.status}`,
        }),
      )
    }
  }

  if (/[^\d]/g.test(this.customerPhone)) {
    this.customerPhone = this.customerPhone.replace(/[^\d]/g, '').slice(1)
  }

  // !FIXME: dirty hack to get unique id for each office specificated
  // @ts-ignore
  this.officeCode = this.office

  // find client and if not exist - create if exist trying to add phone number
  if (this.customerName) {
    const customer = await ClientModel.findOne({ name: this.customerName })

    if (!customer) {
      const newClient = await ClientModel.createByOrder(this.customerName, this.customerPhone)
      this.customer = newClient._id
    } else {
      const isPhoneExists = !isEmpty(filter(customer.phone, { phone: this.customerPhone }))

      if (!isPhoneExists) {
        await ClientModel.addPhoneNumber(this.customerName, this.customerPhone, 'Добавлено при создании заявки')
      }

      this.customer = customer._id
    }
  }
})
@plugin(AutoIncrement as any, {
  id: 'order_id',
  inc_field: 'id',
  reference_fields: ['officeCode'],
  disable_hooks: true,
})
@plugin(autopopulate as any)
export class Order {
  @prop({ autopopulate: true, ref: 'Client' })
  public customer: Ref<Client>

  @prop({ required: true })
  public customerName: string

  @prop({ required: true })
  public customerPhone: string

  @prop({ autopopulate: true, ref: 'Office' })
  public office: Ref<Office>

  @prop({ autopopulate: false })
  public officeCode: string

  @prop({ default: 'Не указано' })
  public phoneBrand: string

  @prop()
  public managerid: number

  @prop()
  public masterid: number

  @prop({ default: 0 })
  public declaredPrice: number

  @prop({ default: 0 })
  public totalPrice: number

  @prop({ default: 'Нет модели' })
  public phoneModel: string

  @prop({ default: 'Нет серийного номера' })
  public serialNumber: string

  @prop({ default: 'Нет дефекта' })
  public declaredDefect: string

  @prop({ default: 'Нет дефекта' })
  public defect: string

  @prop({ default: 'Нет комплектации' })
  public kit: string

  @prop({ default: new Date() })
  public createdAt: Date

  @prop()
  public closedAt: Date

  @prop({ enum: statuses })
  public status: string

  @prop({ default: false })
  public payed: boolean

  @prop({ type: () => [CompletedWork], _id: false })
  public statusWork: CompletedWork[]

  @prop({ type: () => [SmsMessage], _id: false })
  public statusSms: SmsMessage[]

  @prop({ type: () => [Comment], _id: false })
  public masterComments: Comment[]

  @prop({ type: () => [Comment], _id: false })
  public managerComments: Comment[]

  @prop({ type: () => [Workflow], _id: false })
  public workflow: Workflow[]

  private static async addHelper(target: 'array' | 'workflow', arr: any, data: any, workFlowStart?: string) {
    if (target === 'array') {
      arr.push(extendArrayWithId(arr, data))
    } else if (target === 'workflow') {
      arr.push(
        extendArrayWithId(
          arr,
          await processWorkflowData({
            header: workFlowStart,
            message: data?.message,
            userid: data.userid || null,
          }),
        ),
      )
    }
  }

  private static setHelper(target: 'workflow', arr: any, header: string, comment: string) {
    if (target === 'workflow') {
      arr.push(
        extendArrayWithId(arr, {
          header: header,
          message: comment,
          userid: null,
        }),
      )
    }
  }

  public static async addCompletedWork(this: ReturnModelType<typeof Order>, id: number | string, work: CompletedWork) {
    const order = await this.findOne({ id })
    await this.addHelper('array', order.masterComments, work)
    await this.addHelper('workflow', order.workflow, work, 'закрыта работа')
    return await order.save()
  }

  public static async addSmsMessage(this: ReturnModelType<typeof Order>, id: number | string, message: SmsMessage) {
    const order = await this.findOne({ id })
    await this.addHelper('array', order.masterComments, message)
    await this.addHelper('workflow', order.workflow, message, 'новое сообщение')
    return await order.save()
  }

  public static async addMasterComment(this: ReturnModelType<typeof Order>, id: number | string, comment: Comment) {
    const order = await this.findOne({ id })
    await this.addHelper('array', order.masterComments, comment)
    await this.addHelper('workflow', order.workflow, comment, 'новый комментарий')
    return await order.save()
  }

  public static async addManagerComment(this: ReturnModelType<typeof Order>, id: number | string, comment: Comment) {
    const order = await this.findOne({ id })
    await this.addHelper('array', order.managerComments, comment)
    await this.addHelper('workflow', order.workflow, comment, 'новый комментарий')
    return await order.save()
  }

  public static async addWorkflow(this: ReturnModelType<typeof Order>, id: number | string, workflow: Workflow) {
    return this.findOneAndUpdate({ id }, { $push: { workflow } }).exec()
  }

  public static async setStatus(
    this: ReturnModelType<typeof Order>,
    id: number | string,
    status: 'Новый' | 'На уточнении' | 'В работе' | 'Готов',
  ) {
    const order = await this.findOne({ id })
    order.status = status
    this.setHelper('workflow', order.workflow, 'Смена статуса заказа', `Установлен статус ${status}`)
    return await order.save()
  }

  public static async setPayed(this: ReturnModelType<typeof Order>, id: number | string, payed: boolean) {
    const order = await this.findOne({ id })
    const oldPayedStatus = order.payed
    order.payed = payed
    this.setHelper(
      'workflow',
      order.workflow,
      'Смена статуса оплаты',
      `Статус оплаты изменён с ${oldPayedStatus} на ${payed}`,
    )
    return await order.save()
  }

  public static async setMaster(this: ReturnModelType<typeof Order>, id: number | string, master: number) {
    const order = await this.findOne({ id })
    if (order.masterid) {
      const oldMaster = await UserModel.findOne({ id: order.masterid })
      const newMaster = await UserModel.findOne({ id: master })
      this.setHelper(
        'workflow',
        order.workflow,
        'Смена мастера',
        `Мастер изменён с ${oldMaster.credentials} на ${newMaster.credentials}`,
      )
    } else {
      const newMaster = await UserModel.findOne({ id: master })

      this.setHelper(
        'workflow',
        order.workflow,
        'Назначение мастера',
        `Выставлен ответственный мастер ${newMaster.credentials}`,
      )
    }
    order.masterid = master
    return await order.save()
  }

  public static async setManager(this: ReturnModelType<typeof Order>, id: number | string, manager: number) {
    const order = await this.findOne({ id })
    if (order.managerid) {
      const oldManager = await UserModel.findOne({ id: order.managerid })
      const newManager = await UserModel.findOne({ id: manager })
      this.setHelper(
        'workflow',
        order.workflow,
        'Смена менеджера',
        `Менеджер изменён с ${oldManager.credentials} на ${newManager.credentials}`,
      )
    } else {
      const newManager = await UserModel.findOne({ id: manager })

      this.setHelper(
        'workflow',
        order.workflow,
        'Назначение менеджера',
        `Выставлен ответственный менеджер ${newManager.credentials}`,
      )
    }
    order.managerid = manager
    return await order.save()
  }

  public static async setOffice(this: ReturnModelType<typeof Order>, id: number | string, officeCode: string) {
    const order = await this.findOne({ id })
    const office = await OfficeModel.getOneByCode(officeCode)
    order.office = office._id
    this.setHelper('workflow', order.workflow, 'Изменение офиса', `Изменен офис на ${office.code}`)
    return await order.save()
  }
}

export const OrderModel = getModelForClass(Order)
