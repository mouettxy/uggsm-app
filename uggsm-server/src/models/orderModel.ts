import { user } from './../middlewares/validators/validateUser'
import { Office, OfficeModel, UserModel } from '.'
import { pre, plugin, getModelForClass, prop, Ref, ReturnModelType, mongoose, index } from '@typegoose/typegoose'
import autopopulate from 'mongoose-autopopulate'
import { AutoIncrement } from '../utils'
import { filter, isEmpty } from 'lodash'
import { Client, ClientModel } from './clientModel'
import { processWorkflowData, extendArrayWithId } from '../utils/helpers'
import { Adversitement } from './adversitementModel'
import { User } from './userModel'
import mongoosePaginate from 'mongoose-paginate-v2'
import { statuses } from '../utils/enums'
import mongooseSearch from 'mongoose-partial-search'

export class CompletedWork {
  @prop()
  public id: number

  @prop()
  public userid: number

  @prop()
  public username: string

  @prop({ default: '' })
  public credentials: string

  @prop()
  public header: string

  @prop()
  public message: string

  @prop()
  public price: number
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

  @prop({ default: Date.now })
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

  @prop({ default: Date.now })
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

  @prop({ default: Date.now })
  public date?: Date
}

@pre<Order>('save', async function () {
  if (this.isNew) {
    if (!this.status) {
      this.status = 'Новый'
    }

    this.workflow.push(
      extendArrayWithId(this.workflow, {
        header: `Смена статуса заказа`,
        userid: null,
        message: `${this.status}`,
      })
    )

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

      this.workflow.push(
        extendArrayWithId(this.workflow, {
          header: `Назначен клиент`,
          userid: null,
          // @ts-ignore
          message: `${this.customerName}`,
        })
      )
    }

    const master = await UserModel.findById(this.master)
    this.workflow.push(
      extendArrayWithId(this.workflow, {
        header: `Назначен мастер`,
        userid: null,
        message: `${master.credentials}`,
      })
    )

    const manager = await UserModel.findById(this.manager)
    this.workflow.push(
      extendArrayWithId(this.workflow, {
        header: `Назначен менеджер`,
        userid: null,
        message: `${manager.credentials}`,
      })
    )

    if (/[^\d]/g.test(this.customerPhone)) {
      this.customerPhone = this.customerPhone.replace(/[^\d]/g, '').slice(1)
    }

    const office = await OfficeModel.findById(this.office)

    this.officeCode = office.code
  }
})
@plugin(mongooseSearch)
@plugin(mongoosePaginate)
@plugin(AutoIncrement as any, {
  id: 'order_id',
  inc_field: 'id',
  reference_fields: ['officeCode'],
  disable_hooks: true,
})
@plugin(autopopulate)
export class Order {
  @prop({ autopopulate: true, ref: 'Client' })
  public customer: Ref<Client>

  @prop({ required: true, searchable: true })
  public customerName: string

  @prop({ required: true, searchable: true })
  public customerPhone: string

  @prop({ autopopulate: true, ref: 'Office' })
  public office: Ref<Office>

  @prop()
  public officeCode: string

  @prop({ default: 'Не указано', searchable: true })
  public phoneBrand: string

  @prop({ autopopulate: true, ref: 'User' })
  public manager: Ref<User>

  @prop({ autopopulate: true, ref: 'User' })
  public master: Ref<User>

  @prop({ default: false })
  public quick: boolean

  @prop({ default: 0 })
  public declaredPrice: number

  @prop({ default: 'Нет модели', searchable: true })
  public phoneModel: string

  @prop({ default: 'Нет серийного номера', searchable: true })
  public serialNumber: string

  @prop({ default: 'Нет описания внешнего вида', searchable: true })
  public appearance: string

  @prop({ default: 'Платный' })
  public orderType: string

  @prop({ default: 'Нет дефекта', searchable: true })
  public declaredDefect: string

  @prop({ default: 'Нет дефекта', searchable: true })
  public defect: string

  @prop({ default: 'Нет комплектации', searchable: true })
  public kit: string

  @prop({ default: Date.now })
  public createdAt: Date

  @prop({ default: '-', searchable: true })
  public password: string

  @prop()
  public estimatedCloseAt: Date

  @prop()
  public closedAt: Date

  @prop({ autopopulate: true, ref: 'Adversitement' })
  public adversitement: Ref<Adversitement>

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
          })
        )
      )
    }
  }

  private static async setHelper(
    target: 'workflow',
    arr: any,
    header: string,
    comment: string,
    userid?: number | string | undefined
  ) {
    if (target === 'workflow') {
      const workflow = extendArrayWithId(
        arr,
        await processWorkflowData({
          header,
          message: comment,
          userid: userid,
        })
      )
      arr.push(workflow)
    }

    return arr
  }

  public static async addCompletedWork(this: ReturnModelType<typeof Order>, id: number | string, work: CompletedWork) {
    const order = await this.findOne({ id })
    await this.addHelper('array', order.statusWork, work)
    await this.addHelper('workflow', order.workflow, work, 'Закрыта работа')
    return await order.save()
  }

  public static async addSmsMessage(this: ReturnModelType<typeof Order>, id: number | string, message: SmsMessage) {
    const order = await this.findOne({ id })
    await this.addHelper('array', order.statusSms, message)
    await this.addHelper('workflow', order.workflow, message, 'Новое сообщение')
    return await order.save()
  }

  public static async addMasterComment(this: ReturnModelType<typeof Order>, id: number | string, comment: Comment) {
    const order = await this.findOne({ id })
    await this.addHelper('array', order.masterComments, comment)
    await this.addHelper('workflow', order.workflow, comment, 'Новый комментарий')
    return await order.save()
  }

  public static async addManagerComment(this: ReturnModelType<typeof Order>, id: number | string, comment: Comment) {
    const order = await this.findOne({ id })
    await this.addHelper('array', order.managerComments, comment)
    await this.addHelper('workflow', order.workflow, comment, 'Новый комментарий')
    return await order.save()
  }

  public static async addWorkflow(this: ReturnModelType<typeof Order>, id: number | string, workflow: Workflow) {
    return this.findOneAndUpdate({ id }, { $push: { workflow } }).exec()
  }

  public static async setStatus(
    this: ReturnModelType<typeof Order>,
    id: number | string,
    status: 'Новый' | 'На уточнении' | 'В работе' | 'Готов' | 'Закрыт',
    userid: string | number
  ) {
    const order = await this.findOne({ id })

    order.status = status
    order.workflow = await this.setHelper('workflow', order.workflow, 'Смена статуса заказа', `${status}`, userid)

    if (status === 'Закрыт' || status === 'Готов') {
      order.closedAt = new Date()
    }

    return await order.save()
  }

  public static async setPayed(
    this: ReturnModelType<typeof Order>,
    id: number | string,
    payed: boolean,
    userid: string | number
  ) {
    const order = await this.findOne({ id })
    const oldPayedStatus = order.payed ? 'Оплачено' : 'Не оплачено'
    order.payed = payed
    order.workflow = await this.setHelper(
      'workflow',
      order.workflow,
      'Смена статуса оплаты',
      `Изменён с "${oldPayedStatus}" на "${payed ? 'Оплачено' : 'Не оплачено'}"`,
      parseInt(userid as string)
    )
    return await order.save()
  }

  public static async setMaster(
    this: ReturnModelType<typeof Order>,
    id: number | string,
    master: mongoose.Types.ObjectId,
    userid: string | number
  ) {
    const order = await this.findOne({ id })
    if (order.master) {
      const oldMaster = await UserModel.findById(order.master)
      const newMaster = await UserModel.findById(master)
      order.workflow = await this.setHelper(
        'workflow',
        order.workflow,
        'Смена мастера',
        `Мастер изменён с "${oldMaster.credentials}" на "${newMaster.credentials}"`
      )
    } else {
      const newMaster = await UserModel.findById(master)

      order.workflow = await await this.setHelper(
        'workflow',
        order.workflow,
        'Назначен мастер',
        `${newMaster.credentials}`,
        parseInt(userid as string)
      )
    }
    order.master = master
    return await order.save()
  }

  public static async setManager(
    this: ReturnModelType<typeof Order>,
    id: number | string,
    manager: mongoose.Types.ObjectId,
    userid: string | number
  ) {
    const order = await this.findOne({ id })
    if (order.manager) {
      const oldManager = await UserModel.findById(order.manager)
      const newManager = await UserModel.findById(manager)
      order.workflow = await this.setHelper(
        'workflow',
        order.workflow,
        'Смена менеджера',
        `Менеджер изменён с "${oldManager.credentials}" на "${newManager.credentials}"`,
        parseInt(userid as string)
      )
    } else {
      const newManager = await UserModel.findById(manager)

      order.workflow = await this.setHelper(
        'workflow',
        order.workflow,
        'Назначен менеджер',
        `${newManager.credentials}`,
        parseInt(userid as string)
      )
    }
    order.manager = manager
    return await order.save()
  }

  public static async setOffice(
    this: ReturnModelType<typeof Order>,
    id: number | string,
    officeCode: string,
    userid: string | number
  ) {
    const order = await this.findOne({ id })
    const office = await OfficeModel.getOneByCode(officeCode)
    order.office = office._id
    order.workflow = await this.setHelper(
      'workflow',
      order.workflow,
      'Изменение офиса',
      `Изменен офис на ${office.code}|${office.name}`,
      parseInt(userid as string)
    )
    return await order.save()
  }
}

export const OrderModel = getModelForClass(Order)
