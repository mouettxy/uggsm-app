import { settingsModule } from './../index'
import { filter, map, reduce, zip, fromPairs, assign, cloneDeep } from 'lodash'

export class TableHelpers {
  public static generateOptions(
    page: number,
    perPage: number,
    initialSortBy: string,
    extendFieldsFn?: (options: any) => any
  ) {
    let options = {
      page,
      itemsPerPage: perPage,
      sortBy: [initialSortBy],
      sortDesc: [true],
      mustSort: false,
      multiSort: true,
      search: '',
    }

    if (extendFieldsFn) {
      options = extendFieldsFn(options)
    }

    return options
  }

  public static generateHeaders(headers: Record<string, string>, id?: string) {
    let result: Array<{ text: string; value: string; show: boolean; width?: string }> = []

    for (const value in headers) {
      result.push({
        text: headers[value],
        value,
        show: true,
      })
    }

    if (id) {
      const savedHeaders = localStorage.getItem(id)

      if (savedHeaders) {
        result = JSON.parse(savedHeaders)
      }
    }

    return result
  }

  public static excludeNotShownHeaders(headers: Array<{ text: string; value: string; show: boolean }>) {
    return filter(headers, (e) => e.show)
  }

  public static normalizeResponse(response: Record<string, any> | null, include: string[]) {
    const template = (element: Record<string, any>) =>
      reduce(
        map(include, (e) => ({
          [e]: element[e],
        })),
        (a, e) => {
          return assign(a, e)
        },
        {}
      )
    return map(response, (e) => template(e))
  }

  public static processQuery(options: any, modify?: (query: any) => any) {
    const office = settingsModule.office?._id
    let query: any = {
      page: options.page,
      limit: options.itemsPerPage,
      office,
    }

    if (settingsModule.search) {
      query.search = settingsModule.search
    }

    if (options.filter) {
      query.filter = options.filter
    }

    const sortDesc = map(options.sortDesc, (e) => (e ? 'desc' : 'asc'))

    query.sort = fromPairs(zip(options.sortBy, sortDesc))

    if (modify) {
      query = modify(query)
    }

    return query
  }

  public static changeHeaderVisibility(headers: any, payload: { header: string; value: boolean }) {
    const copy = cloneDeep(headers)
    for (const key in copy) {
      if (copy[key]['value'] === payload.header) {
        copy[key]['show'] = payload.value
      }
    }
    return copy
  }
}
