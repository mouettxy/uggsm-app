import { Token, TokenCompares, TokenPlainTypes, TokenValues } from '@/typings/TokenFilter'
import moment from 'moment'
import { sprintf } from 'sprintf-js'

export const comparesTranslate: Record<TokenCompares, string> = {
  is: 'равно %s',
  'not is': 'не равно %s',
  contains: 'содержит %s',
  'not contains': 'не содержит %s',
  between: 'между %s и %s',
  'greater than': 'больше чем %s',
  'not greater than': 'не больше чем %s',
}

export const comparesTranslateSolo = (compare: TokenCompares) => {
  return comparesTranslate[compare].replace(/(\s%.{1})/g, '')
}

export const comparesTranslateSprintf = (compare: TokenCompares, ...args: any[]) => {
  const modifyArgs = (compare: TokenCompares, a: any[]) => {
    const args = a[0]
    if (compare === 'between') {
      return args
    }

    if (['contains', 'not contains'].includes(compare)) {
      return [args.join(', ')]
    }

    return a
  }
  const translated = comparesTranslate[compare]

  const modifiedArgs = modifyArgs(compare, args)

  if (modifiedArgs) {
    return sprintf(translated, ...modifiedArgs)
  }

  return sprintf(translated, ' ', ' ')
}

export const prettifyTokenValue = (token: Token, value: TokenValues, type: TokenCompares) => {
  if (token.type === 'boolean') {
    return value ? 'Да' : 'Нет'
  }

  if (token.type === 'date') {
    if (type === 'between') {
      //@ts-ignore
      const dates = value.map((e) => moment(e).format('DD.MM.YYYY'))
      return dates.includes('Invalid date') ? ['', ''] : dates
    }

    //@ts-ignore
    const date = moment(value).format('DD.MM.YYYY')

    return date === 'Invalid date' ? '' : date
  }

  if (token.autocomplete) {
    if (Array.isArray(value)) {
      //@ts-ignore
      return value.map((e) => e.text || e)
    } else if (typeof value === 'object') {
      //@ts-ignore
      return value.text
    }
  }

  return value || ''
}

export const getDefaultTokenValue = (type: TokenPlainTypes, compare: TokenCompares) => {
  if (compare === 'between') {
    if (type === 'number') {
      return [0, 1]
    }

    return ['', '']
  }

  if (type === 'array') {
    return []
  }

  if (type === 'number') {
    return 0
  }

  if (type === 'boolean') {
    return false
  }

  return ''
}
