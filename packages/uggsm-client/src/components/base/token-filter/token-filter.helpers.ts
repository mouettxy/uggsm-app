export type TokenCompares =
  | 'is'
  | 'not is'
  | 'contains'
  | 'not contains'
  | 'between'
  | 'greater than'
  | 'not greater than'

export type TokenTypeString = {
  type: 'string'
  compares: Extract<TokenCompares, 'is' | 'not is' | 'contains' | 'not contains'>[]
}
export type TokenTypeStringValue = {
  value: string
  type: 'string'
  compares: Extract<TokenCompares, 'is' | 'not is' | 'contains' | 'not contains'>
}

export type TokenTypeNumber = {
  type: 'number'
  compares: Extract<TokenCompares, 'is' | 'not is' | 'between' | 'greater than' | 'not greater than'>[]
}
export type TokenTypeNumberValue = {
  value: number
  type: 'number'
  compares: Extract<TokenCompares, 'is' | 'not is' | 'between' | 'greater than' | 'not greater than'>
}

export type TokenTypeBoolean = {
  type: 'boolean'
  compares: Extract<TokenCompares, 'is' | 'not is'>[]
}
export type TokenTypeBooleanValue = {
  value: boolean
  type: 'boolean'
  compares: Extract<TokenCompares, 'is' | 'not is'>
}

export type TokenTypeDate = {
  type: 'date'
  compares: Extract<TokenCompares, 'between' | 'greater than' | 'not greater than'>[]
}
export type TokenTypeDateValue = {
  value: Date | Array<Date>
  type: 'date'
  compares: Extract<TokenCompares, 'between' | 'greater than' | 'not greater than'>
}

export type TokenTypeArray = {
  type: 'array'
  compares: Extract<TokenCompares, 'contains' | 'not contains'>[]
}
export type TokenTypeArrayValue = {
  value: Array<string | number>
  type: 'array'
  compares: Extract<TokenCompares, 'contains' | 'not contains'>
}

export type TokenTypes = TokenTypeString | TokenTypeNumber | TokenTypeBoolean | TokenTypeDate | TokenTypeArray
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
  id?: number
  token: Token
  disabled: boolean
  display: boolean
} & TokenTypesValue

export const comparesTranslate: Record<TokenCompares, string> = {
  is: 'равно %s',
  'not is': 'не равно %s',
  contains: 'содержит %s',
  'not contains': 'не содержит %s',
  between: 'между %s и %s',
  'greater than': 'больше чем %s',
  'not greater than': 'не больше чем %s',
}
