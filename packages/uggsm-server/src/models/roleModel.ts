import { getModelForClass, prop } from '@typegoose/typegoose'

class RoleAbility {
  @prop()
  public description: string

  @prop()
  public name: string

  @prop()
  public value: boolean
}

class RoleResource {
  @prop()
  public description: string

  @prop()
  public name: string

  @prop({ type: () => [RoleAbility], _id: false })
  public abilities: RoleAbility[]
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
