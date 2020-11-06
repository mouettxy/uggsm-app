import { getModelForClass, prop, Ref, plugin } from '@typegoose/typegoose'
import { Order } from './orderModel'
import autopopulate from 'mongoose-autopopulate'
import mongoosePaginate from 'mongoose-paginate-v2'
import mongooseSearch from 'mongoose-partial-search'

@plugin(mongooseSearch)
@plugin(mongoosePaginate)
@plugin(autopopulate)
export class Call {
  @prop()
  public dbId: number

  @prop({ ref: 'Order' })
  public relatedOrder: Ref<Order>

  @prop()
  public incoming: boolean

  @prop()
  public answered: boolean

  @prop()
  public clientNumber: string

  @prop()
  public manager: string

  @prop()
  public managerNumber: string

  @prop()
  public record: string

  @prop()
  public startTime: Date

  @prop()
  public endTime: Date

  @prop()
  public answerTime: Date
}

export const CallModel = getModelForClass(Call)
