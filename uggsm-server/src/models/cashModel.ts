import { plugin, getModelForClass, prop, Ref, pre } from '@typegoose/typegoose'
import autopopulate from 'mongoose-autopopulate'
import { AutoIncrement } from '../utils'
import mongoosePaginate from 'mongoose-paginate-v2'
import { ClientModel, OrderModel, Office } from '.'
import { Client } from './clientModel'
import { User } from './userModel'
import mongooseSearch from 'mongoose-partial-search'

@pre<Cash>('save', async function () {
  if (this.orderid && this.client) {
    if (!this.comment) {
      const order = await OrderModel.findOne({ id: this.orderid })
      const client = await ClientModel.findById(this.client)

      this.comment = `Оплата по заказу #${this.orderid} (${order.phoneModel}) (Клиент: ${client.name})`
    }
  } else if (this.orderid && !this.client) {
    const order = await OrderModel.findOne({ id: this.orderid })

    this.comment = `Оплата по заказу #${this.orderid} (${order.phoneModel})`
  } else if (!this.orderid && this.client) {
    const client = await ClientModel.findById(this.client)

    this.comment = `Оплата (Клиент: ${client.name})`
  } else if (!this.orderid && !this.client && !this.comment) {
    this.comment = 'Оплата'
  }

  let income = await CashModel.aggregate()
    .match({ office: this.office })
    .group({ _id: null, sum: { $sum: '$income' } })

  let consumption = await CashModel.aggregate()
    .match({ office: this.office })
    .group({ _id: null, sum: { $sum: '$consumption' } })

  income = income[0]?.sum ? income[0]?.sum : 0
  consumption = consumption[0]?.sum ? consumption[0]?.sum : 0

  if (typeof income === 'number' && typeof consumption === 'number') {
    // @ts-ignore
    income += this.income ? this.income : 0
    // @ts-ignore
    consumption += this.consumption ? this.consumption : 0
    this.balance = income - consumption
  } else {
    this.balance = this.income
  }
})
@plugin(mongooseSearch)
@plugin(AutoIncrement as any, {
  id: 'cash_id',
  inc_field: 'id',
})
@plugin(mongoosePaginate)
@plugin(autopopulate as any)
export class Cash {
  @prop({ default: Date.now })
  public createdAt: Date

  @prop({ autopopulate: true, ref: 'Office', required: true })
  public office: Ref<Office>

  @prop({ default: 0 })
  public income: number

  @prop()
  public orderid?: number

  @prop({ autopopulate: true, ref: 'Client' })
  public client?: Ref<Client>

  @prop({ autopopulate: true, ref: 'User', required: true })
  public cashier: Ref<User>

  @prop({ searchable: true })
  public comment: string

  @prop({ default: 0 })
  public consumption: number

  @prop({ default: 0 })
  public balance: number

  public static async getBalanceByOffice(officeCode) {
    let income = await CashModel.aggregate()
      .match({ office: officeCode })
      .group({ _id: null, sum: { $sum: '$income' } })

    let consumption = await CashModel.aggregate()
      .match({ office: officeCode })
      .group({ _id: null, sum: { $sum: '$consumption' } })

    income = income[0]?.sum ? income[0]?.sum : 0
    consumption = consumption[0]?.sum ? consumption[0]?.sum : 0

    if (typeof income === 'number' && typeof consumption === 'number') {
      // @ts-ignore
      income += this.income ? this.income : 0
      // @ts-ignore
      consumption += this.consumption ? this.consumption : 0
      return income - consumption
    }

    return 0
  }
}

export const CashModel = getModelForClass(Cash)
