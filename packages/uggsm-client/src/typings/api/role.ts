import { Actions, Subjects } from './../UggsmAbility'
export type RoleAbility = {
  value: string | boolean | Array<string>
  name: Actions
  description: string
  operator: string
  type: string
  resource?: Subjects
  autocomplete: string
}

export type Role = {
  value: string
  name: string
  description: string
  abilities: RoleAbility[]
}

export type Roles = Role[]

export type RoleInput = Omit<Role, 'abilities'>

export type AbilityInput = RoleAbility
