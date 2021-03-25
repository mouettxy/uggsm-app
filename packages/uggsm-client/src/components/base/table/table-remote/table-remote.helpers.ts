import { filter, fromPairs, map, zip } from 'lodash'
import { Component, Vue } from 'vue-property-decorator'

@Component
export class TableRemoteHelpers extends Vue {
  public search = ''

  generateOptions(
    page: number,
    itemsOnPage: number,
    initialSort: { by: string; desc: boolean },
    modifyFields?: (options: any) => any
  ) {
    let options = {
      page,
      itemsPerPage: itemsOnPage,
      sortBy: [initialSort.by],
      sortDesc: [initialSort.desc],
      mustSort: false,
      multiSort: true,
      search: '',
    }

    if (modifyFields) {
      options = modifyFields(options)
    }

    return options
  }

  generateHeaders(headers: Record<string, string>, id?: string) {
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

  excludeNotShownHeaders(headers: Array<{ text: string; value: string; show: boolean }>) {
    return filter(headers, (e) => e.show)
  }

  processQuery(options: any, modify?: ((query: any) => any) | boolean) {
    let query: any = {
      page: options.page,
      limit: options.itemsPerPage,
    }

    if (this.search) {
      query.page = 1
      query.search = this.search
    }

    if (options.filter) {
      query.filter = options.filter
    }

    const sortDesc = map(options.sortDesc, (e) => (e ? 'desc' : 'asc'))

    query.sort = fromPairs(zip(options.sortBy, sortDesc))

    if (modify && typeof modify !== 'boolean') {
      query = modify(query)
    }

    return query
  }
}

export default TableRemoteHelpers
