import { getModelForClass, prop } from '@typegoose/typegoose'

export class EmailSubscription {
  @prop({ enum: ['daily-report'] })
  public type: string

  @prop()
  public email: string
}

export const EmailSubcriptionModel = getModelForClass(EmailSubscription)
