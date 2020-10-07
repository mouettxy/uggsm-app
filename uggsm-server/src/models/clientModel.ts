import { getModelForClass, prop, plugin, ReturnModelType, Ref, pre } from '@typegoose/typegoose'
import autopopulate from 'mongoose-autopopulate'
import { AutoIncrement } from '../utils'
import { extendArrayWithId } from '../utils/helpers'
import { Adversitement } from '.'
import mongoosePaginate from 'mongoose-paginate-v2'

export const clientTypes = ['физ. лицо', 'компания']

export class ClientPhone {
  @prop()
  public id: number

  @prop()
  public phone: string

  @prop()
  public comment?: string
}

@pre<Client>('save', async function() {
  // if (!this.adversitement) {
  //   // this.adversitement = (await AdversitementModel.findOne({ name: 'default' }))._id
  // }
})
@plugin(AutoIncrement as any, {
  id: 'client_id',
  inc_field: 'id',
})
@plugin(mongoosePaginate)
@plugin(autopopulate as any)
export class Client {
  @prop({ default: new Date() })
  public createdAt: Date

  @prop({ unique: true, required: true })
  public name: string

  @prop()
  public email: string

  @prop({ autopopulate: true, ref: 'Adversitement' })
  public adversitement: Ref<Adversitement>

  @prop()
  public comment: string

  @prop()
  public address: string

  @prop({ default: 0 })
  public discount: number

  @prop({ default: true })
  public allowedEmailNotifications: boolean

  @prop({ default: true })
  public allowedNotifications: boolean

  @prop({ default: 'физ. лицо', enum: clientTypes })
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
    comment?: string,
  ) {
    const client = await this.findOne({ name })
    client.phone.push(extendArrayWithId(client.phone, { phone, comment }))
    return await client.save()
  }
}

export const ClientModel = getModelForClass(Client)
