import { plugin, getModelForClass, prop, Ref, ReturnModelType, pre } from '@typegoose/typegoose'
import autopopulate from 'mongoose-autopopulate'
import { AutoIncrement } from '../utils'
import { extendArrayWithId } from '../utils/helpers'
import { ClientModel, OrderModel, Office } from '.'

@pre<Cash>('save', async function() {
  if (this.orderid && this.clientid) {
    if (!this.comment) {
      const order = await OrderModel.findOne({ id: this.orderid })
      const client = await ClientModel.findOne({ id: this.clientid })

      this.comment = `Оплата по заказу #${this.orderid} (${order.phoneModel}) (Клиент: ${client.name})`
    }
  } else if (this.orderid && !this.clientid) {
    const order = await OrderModel.findOne({ id: this.orderid })

    this.comment = `Оплата по заказу #${this.orderid} (${order.phoneModel})`
  } else if (!this.orderid && this.clientid) {
    const client = await ClientModel.findOne({ id: this.clientid })

    this.comment = `Оплата (Клиент: ${client.name})`
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
@plugin(AutoIncrement as any, {
  id: 'cash_id',
  inc_field: 'id',
})
@plugin(autopopulate as any)
export class Cash {
  @prop({ default: new Date() })
  public createdAt: Date

  @prop({ autopopulate: true, ref: 'Office', required: true })
  public office: Ref<Office>

  @prop({ default: 0 })
  public income: number

  @prop()
  public orderid?: number

  @prop()
  public clientid?: number

  @prop()
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
