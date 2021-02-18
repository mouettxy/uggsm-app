import { getModelForClass, ModelOptions, mongoose, prop, Severity } from '@typegoose/typegoose'

@ModelOptions({ options: { allowMixed: Severity.ALLOW } })
class RoleAbility {
  @prop({ required: true, type: () => mongoose.Schema.Types.Mixed })
  public value!: string | boolean | Array<string>

  @prop({ required: true })
  public name!: string

  @prop({ required: true })
  public description!: string

  @prop({ required: true })
  public operator!: string

  @prop({ required: true })
  public type!: string

  @prop()
  public autocomplete: string
}

export class Role {
  @prop({ required: true })
  public value!: string

  @prop({ required: true })
  public name!: string

  @prop({ required: true })
  public description!: string

  @prop({ default: [], type: () => [RoleAbility], _id: false })
  public abilities: RoleAbility[]
}

export const RoleModel = getModelForClass(Role)
