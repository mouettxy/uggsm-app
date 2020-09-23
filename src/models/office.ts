import { getModelForClass, prop, ReturnModelType } from '@typegoose/typegoose'

export class Office {
  @prop({ required: true, unique: true })
  public code: string

  @prop({ required: true })
  public name: string

  @prop({ required: true })
  public ordersTemplate: string

  @prop({ required: true })
  public docsTemplate: string

  @prop({ required: true })
  public address: string

  public get ordersTemplateParsed() {
    const regExp = /(\d){1}\{\C\:(\d){1}\}/g.exec(this.ordersTemplate)
    return [regExp[1], regExp[2]]
  }

  public static getOneByCode(this: ReturnModelType<typeof Office>, code: string) {
    return this.findOne({ code }).exec()
  }
}

export const OfficeModel = getModelForClass(Office)
