import { VuexFilterList, VuexFilterListNamespaces } from '@/typings/TokenFilter'

const generateFilters = (filters: VuexFilterListNamespaces[]) => {
  const defaultFilterEntry = Object.fromEntries(filters.map((e) => [e, ''])) as Record<VuexFilterListNamespaces, string>
  const filterList = (Object.fromEntries(
    filters.map((e) => [
      e,
      {
        default: [],
        custom: [],
        current: [],
      },
    ])
  ) as unknown) as VuexFilterList

  const returned: {
    defaultFilterEntry: Record<VuexFilterListNamespaces, string>
    filterList: VuexFilterList
  } = {
    defaultFilterEntry,
    filterList,
  }

  return returned
}

const filterList: VuexFilterListNamespaces[] = ['calls', 'cashes', 'clients', 'orders', 'tests']

export const generatedFilters = generateFilters(filterList)

import { Token, TokenCompares, TokenPlainTypes, TokenValues } from '@/typings/TokenFilter'
import moment from 'moment'

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

export const Filters: Record<string, Token[]> = {
  orders: [
    {
      value: 'id',
      type: 'number',
      name: '№ Заказа',
      compares: ['is', 'between', 'greater than', 'not is', 'not greater than'],
      disabled: false,
    },
    {
      value: 'createdAt',
      type: 'date',
      name: 'Дата создания',
      compares: ['between', 'greater than', 'not greater than'],
      disabled: false,
    },
    {
      value: 'estimatedCloseAt',
      type: 'date',
      name: 'Примерная дата готовности',
      compares: ['between', 'greater than', 'not greater than'],
      disabled: false,
    },
    {
      value: 'closedAt',
      type: 'date',
      name: 'Дата закрытия',
      compares: ['between', 'greater than', 'not greater than'],
      disabled: false,
    },
    {
      value: 'status',
      type: 'array',
      name: 'Статус',
      autocomplete: '/custom?m=Order&f=status',
      compares: ['contains', 'not contains'],
      disabled: false,
    },
    {
      value: 'master',
      type: 'array',
      name: 'Мастер',
      autocomplete: '/custom?m=Order&f=master.credentials&v=master._id',
      compares: ['contains', 'not contains'],
      disabled: false,
    },
    {
      value: 'manager',
      type: 'array',
      name: 'Менеджер',
      autocomplete: '/custom?m=Order&f=manager.credentials&v=manager._id',
      compares: ['contains', 'not contains'],
      disabled: false,
    },
    {
      value: 'phoneBrand',
      type: 'array',
      name: 'Бренд',
      autocomplete: '/custom?m=Order&f=phoneBrand',
      compares: ['contains', 'not contains'],
      disabled: false,
    },
    {
      value: 'phoneModel',
      type: 'array',
      name: 'Модель',
      autocomplete: '/custom?m=Order&f=phoneModel',
      compares: ['contains', 'not contains'],
      disabled: false,
    },
    {
      value: 'orderType',
      type: 'array',
      name: 'Тип заказа',
      autocomplete: '/custom?m=Order&f=orderType',
      compares: ['contains', 'not contains'],
      disabled: false,
    },
    {
      value: 'payed',
      type: 'boolean',
      name: 'Оплачено',
      compares: ['is', 'not is'],
      disabled: false,
    },
    {
      value: 'declaredPrice',
      type: 'number',
      name: 'Стоимость',
      compares: ['between', 'greater than', 'not greater than'],
      disabled: false,
    },
    {
      value: 'declaredDefect',
      type: 'string',
      name: 'Дефект',
      autocomplete: '/custom?m=Order&f=declaredDefect',
      compares: ['is', 'contains', 'not is', 'not contains'],
      disabled: false,
    },
    {
      value: 'kit',
      type: 'string',
      name: 'Комплектация',
      autocomplete: '/custom?m=Order&f=kit',
      compares: ['is', 'contains', 'not is', 'not contains'],
      disabled: false,
    },
    {
      value: 'customerName',
      type: 'string',
      name: 'Клиент',
      autocomplete: '/custom?m=Order&f=customer.name',
      compares: ['is', 'contains', 'not is', 'not contains'],
      disabled: false,
    },
    {
      value: 'serialNumber',
      type: 'string',
      name: 'Серийный номер',
      autocomplete: '/custom?m=Order&f=serialNumber',
      compares: ['is', 'contains', 'not is', 'not contains'],
      disabled: false,
    },
    {
      value: 'appearance',
      type: 'string',
      name: 'Внешний вид',
      autocomplete: '/custom?m=Order&f=appearance',
      compares: ['is', 'contains', 'not is', 'not contains'],
      disabled: false,
    },
  ],
}
