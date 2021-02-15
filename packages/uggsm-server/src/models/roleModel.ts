import { getModelForClass, modelOptions, prop, Severity } from '@typegoose/typegoose'
import mongoose, { mongo } from 'mongoose'

class FieldSettings {
  @prop({ enum: ['=', 'in', '!in', '!='] })
  public operator: string

  @prop({ enum: ['array', 'string', 'boolean'] })
  public type: string
}
class RoleAbility {
  @prop()
  public description: string

  @prop()
  public name: string

  @prop()
  public value: boolean

  @prop({ type: () => [AbilityField], _id: false })
  public fields?: AbilityField[]
}

class RoleResource {
  @prop()
  public description: string

  @prop()
  public name: string

  @prop({ type: () => [RoleAbility], _id: false })
  public abilities: RoleAbility[]
}
@modelOptions({
  options: {
    allowMixed: Severity.ALLOW,
  },
})
class AbilityField {
  @prop()
  public description: string

  @prop()
  public name: string

  @prop({ type: () => mongoose.Schema.Types.Mixed })
  public value: Array<string> | boolean | string

  @prop({ type: () => FieldSettings, _id: false })
  public settings: FieldSettings
}

export class Role {
  @prop({ required: true })
  public name!: string

  @prop({ required: true })
  public description!: string

  @prop({ default: [], type: () => [RoleResource], _id: false })
  public resources: RoleResource[]
}

export const RoleModel = getModelForClass(Role)
