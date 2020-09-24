import { getModelForClass, prop, plugin } from '@typegoose/typegoose'
import { AutoIncrement } from '../utils'

@plugin(AutoIncrement as any, {
  id: 'adversitement_id',
  inc_field: 'id',
})
export class Adversitement {
  @prop({ default: new Date() })
  public createdAt: Date

  @prop({ required: true })
  public name: string

  @prop({ required: true })
  public title: string
}

export const AdversitementModel = getModelForClass(Adversitement)
