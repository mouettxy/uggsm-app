import { getModelForClass, prop, Ref, plugin } from '@typegoose/typegoose'
import autopopulate from 'mongoose-autopopulate'
import { Office } from '.'
import { AutoIncrement } from '../utils'
import mongoosePaginate from 'mongoose-paginate-v2'
import mongooseSearch from 'mongoose-partial-search'

@plugin(mongooseSearch)
@plugin(mongoosePaginate)
@plugin(AutoIncrement as any, {
  id: 'user_id',
  inc_field: 'id',
})
@plugin(autopopulate as any)
export class User {
  @prop({ required: true, searchable: true })
  public username: string

  @prop({ required: true })
  public password: string

  @prop({ required: true, searchable: true })
  public credentials: string

  @prop({ required: true, searchable: true })
  public role: string

  @prop({ autopopulate: true, ref: 'Office' })
  public office: Ref<Office>

  @prop({ default: [], type: String })
  public tokens: string[]
}

export const UserModel = getModelForClass(User)
