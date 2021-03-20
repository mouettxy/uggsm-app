import { map } from 'lodash'
import { Filter, NormalizedFilter } from '../interfaces/filters/TokenFilter'

function normalizeFilterList(denormalizedFilterList: Filter[]): NormalizedFilter[] {
  return map(denormalizedFilterList, (e) => ({
    field: e.token.value,
    type: e.token.type,
    value: e.value,
    compares: e.compares,
    disabled: e.disabled,
  }))
}

function castFilterValue(filterEntry: NormalizedFilter) {
  const isArray = filterEntry.type === 'array'
  const isNumber = filterEntry.type === 'number'
  const isDate = filterEntry.type === 'date'
  const isString = filterEntry.type === 'string'
  const isBetweenCompares = filterEntry.compares === 'between'
  const filterValue = filterEntry.value

  if (isNumber) {
    return parseInt(filterValue as string)
  } else if (isDate) {
    if (isBetweenCompares) {
      return map(filterValue as Array<Date>, (e) => new Date(e))
    }

    return new Date(filterValue as Date)
  } else if (isArray && (filterValue as Array<unknown>).length) {
    if (filterValue[0]?.text) {
      return map(filterValue as Array<{ text: string; value: string }>, (e) => e.value)
    }
  } else if (isString) {
    if ((filterValue as { text: string; value: string })?.text) {
      return (filterValue as { text: string; value: string }).value
    }
  }

  return filterValue
}

function castFilterCompares(filterEntry: NormalizedFilter) {
  const isString = filterEntry.type === 'string'
  const isBetweenCompares = filterEntry.compares === 'between'
  const isEquals = filterEntry.compares === 'is'
  const isNotEquals = filterEntry.compares === 'not is'
  const isContains = filterEntry.compares === 'contains'
  const isNotContains = filterEntry.compares === 'not contains'
  const isGreaterThan = filterEntry.compares === 'greater than'
  const isLesserThan = filterEntry.compares === 'not greater than'

  const queries = {
    $gte$lt: (greaterThan, lesserThan) => ({
      $gte: greaterThan,
      $lt: lesserThan,
    }),
    $eq: (value) => ({
      $eq: value,
    }),
    $ne: (value) => ({
      $ne: value,
    }),
    $in: (value) => ({
      $in: value,
    }),
    $nin: (value) => ({
      $nin: value,
    }),
    $gte: (value) => ({
      $gte: value,
    }),
    $lte: (value) => ({
      $lte: value,
    }),
  }

  if (isBetweenCompares) {
    return queries.$gte$lt
  }

  if (isEquals) {
    return queries.$eq
  } else if (isNotEquals) {
    return queries.$ne
  } else if (isContains) {
    if (isString) {
      return (value) => {
        return { $regex: value, $options: 'i' }
      }
    }

    return queries.$in
  } else if (isNotContains) {
    if (isString) {
      return (value) => {
        return { $not: { $regex: value, $options: 'i' } }
      }
    }

    return queries.$nin
  } else if (isGreaterThan) {
    return queries.$gte
  } else if (isLesserThan) {
    return queries.$lte
  }
}

function composeFilters(filters: Array<any>) {
  return { $and: filters }
}

export function parseFilterList(denormalizedFilterList: Filter[]) {
  const filterList = normalizeFilterList(denormalizedFilterList)
  const filters = []

  for (const filterEntry of filterList) {
    if (filterEntry.disabled) {
      continue
    }
    const isBetweenCompares = filterEntry.compares === 'between'

    const filterValue = castFilterValue(filterEntry)
    const filterCompares = castFilterCompares(filterEntry)

    if (isBetweenCompares) {
      filters.push({
        [filterEntry.field]: filterCompares(filterValue[0], filterValue[1]),
      })
    } else {
      filters.push({
        [filterEntry.field]: (filterCompares as (arg) => any)(filterValue),
      })
    }
  }

  const composedFilters = composeFilters(filters)

  return composedFilters
}
