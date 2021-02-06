export type RoleAbility = {
  name: string
  description: string
  value: boolean
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
