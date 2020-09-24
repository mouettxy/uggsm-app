import { getModelForClass, prop, Ref, plugin } from '@typegoose/typegoose'
import autopopulate from 'mongoose-autopopulate'
import { Office } from '.'
import { AutoIncrement } from '../utils'
export const roles = ['Administrator', 'Master', 'Manager']

@plugin(AutoIncrement as any, {
  id: 'user_id',
  inc_field: 'id',
})
@plugin(autopopulate as any)
export class User {
  @prop({ unique: true })
  public id: number

  @prop({ required: true })
  public username: string

  @prop({ required: true })
  public password: string

  @prop({ required: true })
  public credentials: string

  @prop({ required: true, enum: roles })
  public role: string

  @prop({ ref: 'Office' })
  public office: Ref<Office>
}

export const UserModel = getModelForClass(User)