import { getModelForClass, prop } from '@typegoose/typegoose'

class RoleAbility {
  @prop({ required: true })
  public value!: string

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
