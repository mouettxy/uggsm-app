export type FieldSettings = {
  operator: '=' | '!=' | 'in' | '!in'
  type: 'array' | 'string' | 'boolean'
}

export type AbilityField = {
  description: string
  name: string
  value: Array<string> | boolean | string
  settings: FieldSettings
}

export type RoleAbility = {
  name: string
  description: string
  value: boolean
  fields?: AbilityField[]
}

export type RoleResource = {
  name: string
  description: string
  abilities: RoleAbility[]
}

export type Role = {
  name: string
  description: string
  resources: RoleResource[]
}

export type Roles = Role[]

export type RoleInput = Omit<Role, 'resources'> & { resources?: RoleResource[] }

export type ResourceInput = Omit<RoleResource, 'abilities'>

export type AbilityInput = Omit<RoleAbility, 'value'>
