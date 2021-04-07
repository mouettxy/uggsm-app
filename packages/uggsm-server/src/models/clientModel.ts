import { trim, startsWith } from 'lodash'
import { getModelForClass, prop, plugin, ReturnModelType, Ref, pre } from '@typegoose/typegoose'
import autopopulate from 'mongoose-autopopulate'
import { AutoIncrement } from '../utils'
import { extendArrayWithId } from '../utils/helpers'
import mongoosePaginate from 'mongoose-paginate-v2'
import mongooseSearch from 'mongoose-partial-search'

export const clientTypes = ['физ. лицо', 'компания']

export class ClientPhone {
  @prop()
  public id: number

  @prop()
  public phone: string

  @prop()
  public comment?: string
}

@pre<Client>('save', async function () {
  if (this.phone) {
    for (const key in this.phone) {
      let phone = this.phone[key].phone

      phone = trim(phone)

      if (startsWith(phone, '+7')) {
        phone = phone.slice(2)
      }

      if (startsWith(phone, '7')) {
        phone = phone.slice(1)
      }

      if (startsWith(phone, '8')) {
        phone = phone.slice(1)
      }

      phone = phone.replace(/[^0-9]/g, '')

      if (phone.length < 10) {
        phone = ''
      }

      if (phone.length > 10) {
        phone = phone.substring(0, 10)
      }

      this.phone[key].phone = phone
    }
  }
})
@plugin(mongoosePaginate)
@plugin(AutoIncrement as any, {
  id: 'client_id',
  inc_field: 'id',
})
@plugin(mongooseSearch)
@plugin(autopopulate as any)
export class Client {
  @prop({ default: new Date() })
  public createdAt: Date

  @prop({ unique: true, required: true, searchable: true })
  public name: string

  @prop({ searchable: true })
  public email: string

  @prop()
  public adversitement: string

  @prop({ searchable: true })
  public comment: string

  @prop({ searchable: true })
  public address: string

  @prop({ default: 0 })
  public discount: number

  @prop({ default: true })
  public allowedEmailNotifications: boolean

  @prop({ default: true })
  public allowedNotifications: boolean

  @prop({ default: 'физ. лицо', enum: clientTypes, searchable: true })
  public clientType: string

  @prop({ default: false })
  public isProvider: boolean

  @prop({ default: false })
  public isConflict: boolean

  @prop({ type: () => [ClientPhone], _id: false })
  public phone: ClientPhone[]

  public static async createByOrder(this: ReturnModelType<typeof Client>, name: string, phone: string) {
    const phoneObj = extendArrayWithId([], {
      phone,
      comment: 'Добавлено при создании заявки',
    })
    const client = new this({
      name,
    })
    client.phone.push(phoneObj)

    return await client.save()
  }

  public static async addPhoneNumber(
    this: ReturnModelType<typeof Client>,
    name: string,
    phone: string,
    comment?: string
  ) {
    const client = await this.findOne({ name })
    client.phone.push(extendArrayWithId(client.phone, { phone, comment }))
    return await client.save()
  }
}

export const ClientModel = getModelForClass(Client)
