import { getModelForClass, prop, Ref, plugin } from '@typegoose/typegoose'
import autopopulate from 'mongoose-autopopulate'
import { Office } from '.'
import { AutoIncrement } from '../utils'
export const roles = ['administrator', 'master', 'manager']

@plugin(AutoIncrement as any, {
  id: 'user_id',
  inc_field: 'id',
})
@plugin(autopopulate as any)
export class User {
  @prop({ required: true })
  public username: string

  @prop({ required: true })
  public password: string

  @prop({ required: true })
  public credentials: string

  @prop({ required: true, enum: roles })
  public role: string

  @prop({ autopopulate: true, ref: 'Office' })
  public office: Ref<Office>

  @prop({ default: [] })
  public tokens: string[]
}

export const UserModel = getModelForClass(User)
