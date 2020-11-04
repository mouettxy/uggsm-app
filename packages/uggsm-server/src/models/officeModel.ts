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
    const regExp = /(\d*)\{(\w*):(\d*)\}/g.exec(this.ordersTemplate)
    return {
      start: regExp[1],
      modifier: regExp[2],
      modifierCount: parseInt(regExp[3]),
    }
  }

  public static getOneByCode(this: ReturnModelType<typeof Office>, code: string) {
    return this.findOne({ code }).exec()
  }
}

export const OfficeModel = getModelForClass(Office)
