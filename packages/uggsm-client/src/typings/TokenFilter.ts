export type TokenCompares =
  | 'is'
  | 'not is'
  | 'contains'
  | 'not contains'
  | 'between'
  | 'greater than'
  | 'not greater than'

export type TokenValues =
  | string
  | number
  | boolean
  | Date
  | { text: string; value: string }
  | Array<string | number | Date | { text: string; value: string }>

export type TokenPlainTypes = 'string' | 'number' | 'boolean' | 'date' | 'array'

export type TokenTypeString = {
  type: 'string'
  compares: Extract<TokenCompares, 'is' | 'not is' | 'contains' | 'not contains'>[]
}
export type TokenTypeNumber = {
  type: 'number'
  compares: Extract<TokenCompares, 'is' | 'not is' | 'between' | 'greater than' | 'not greater than'>[]
}
export type TokenTypeBoolean = {
  type: 'boolean'
  compares: Extract<TokenCompares, 'is' | 'not is'>[]
}
export type TokenTypeDate = {
  type: 'date'
  compares: Extract<TokenCompares, 'between' | 'greater than' | 'not greater than'>[]
}
export type TokenTypeArray = {
  type: 'array'
  compares: Extract<TokenCompares, 'contains' | 'not contains'>[]
}

export type TokenTypes = TokenTypeString | TokenTypeNumber | TokenTypeBoolean | TokenTypeDate | TokenTypeArray

export type TokenTypeStringValue = {
  value: string | { text: string; value: string }
  compares: Extract<TokenCompares, 'is' | 'not is' | 'contains' | 'not contains'>
}
export type TokenTypeNumberValue = {
  value: number
  compares: Extract<TokenCompares, 'is' | 'not is' | 'between' | 'greater than' | 'not greater than'>
}
export type TokenTypeBooleanValue = {
  value: boolean
  compares: Extract<TokenCompares, 'is' | 'not is'>
}
export type TokenTypeDateValue = {
  value: Date | Date[] | string[]
  compares: Extract<TokenCompares, 'between' | 'greater than' | 'not greater than'>
}
export type TokenTypeArrayValue = {
  value: Array<string | number | { text: string; value: string }>
  compares: Extract<TokenCompares, 'contains' | 'not contains'>
}

export type TokenTypesValue =
  | TokenTypeStringValue
  | TokenTypeNumberValue
  | TokenTypeBooleanValue
  | TokenTypeDateValue
  | TokenTypeArrayValue

export type Token = {
  value: string
  name: string
  autocomplete?: string | Array<{ text: string; value: string }>
  unique?: boolean
  disabled?: boolean
} & TokenTypes

export type Filter = {
  token: Token
  disabled: boolean
  display: boolean
} & TokenTypesValue

export type VuexFilterListNamespaces = 'tests' | 'orders' | 'clients' | 'cashes' | 'calls'
export type VuexFilterListItem = {
  default: {
    name: string
    filter: Filter
  }[]
  custom: {
    name: string
    filter: Filter
  }[]
  current: {
    name: string
    filter: Filter
  }[]
}

export type VuexFilterList = Partial<Record<VuexFilterListNamespaces, VuexFilterListItem>>
