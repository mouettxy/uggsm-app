import { getModelForClass, prop, plugin } from '@typegoose/typegoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import mongooseSearch from 'mongoose-partial-search'

export type AccessEntryResource =
  | { id: 'Order'; value: 'Заказы' }
  | { id: 'Office'; value: 'Офисы' }
  | { id: 'Client'; value: 'Клиенты' }
  | { id: 'User'; value: 'Пользователи' }
  | { id: 'Cash'; value: 'Клиенты' }
  | { id: 'Role'; value: 'Роли' }

export type AccessEntryAction = {
  id: string
  value: string
}

export type AccessEntry = {
  userId: string
  userCredentials: string
  time: Date
  resource: AccessEntryResource
  action: AccessEntryAction
  userIp: string
  userOs: string
  userBrowser: string
}

export class Resource {
  @prop()
  id: string

  @prop()
  value: string
}

export class Action {
  @prop()
  id: string

  @prop()
  value: string
}

@plugin(mongooseSearch)
@plugin(mongoosePaginate)
export class Access {
  @prop({ searchable: true })
  userId: string

  @prop({ searchable: true })
  userCredentials: string

  @prop()
  time: Date

  @prop({ type: () => Resource, _id: false })
  resource: Resource

  @prop({ type: () => Resource, _id: false })
  action: Action

  @prop()
  userIp: string

  @prop()
  userOs: string

  @prop()
  userBrowser: string
}

export const AccessModel = getModelForClass(Access)
