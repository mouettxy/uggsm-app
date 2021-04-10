import { parseFilterList } from './filters'

export function parsePaginationQuery(
  paginationQuery: any,
  model: any,
  modifyQuery: (argument: any) => any | null = null,
  modifyOptions: (argument: any) => any | null = null
) {
  let query: any = {}
  let options: any = {
    page: paginationQuery.page,
    limit: paginationQuery.limit,
  }

  if (paginationQuery.sort) {
    options.sort = paginationQuery.sort
  }

  if (paginationQuery.search) {
    if (model) {
      const searchQuery = model.searchBuilder(paginationQuery.search)
      if (parseInt(paginationQuery.search)) {
        searchQuery.$and[0].$or.push({
          id: { $gte: paginationQuery.search, $lte: paginationQuery.search },
        })

        searchQuery.$and[0].$or.push({
          warrantyOrderId: { $gte: paginationQuery.search, $lte: paginationQuery.search },
        })
      }
      query = {
        ...query,
        ...searchQuery,
      }
    }
  } else {
    if (paginationQuery.filter) {
      const parsedFilter = parseFilterList(paginationQuery.filter)

      if (parsedFilter.$and.length) {
        query = {
          ...query,
          ...parsedFilter,
        }
      }
    }
  }

  if (modifyQuery && typeof modifyQuery === 'function') {
    query = modifyQuery(query)
  }

  if (modifyOptions && typeof modifyOptions === 'function') {
    options = modifyOptions(options)
  }

  return {
    query,
    options,
  }
}
