import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { ordersAPI } from '@/api'
import map from 'lodash/map'
import zip from 'lodash/zip'

import moment from 'moment'
import { settingsModule } from '.'
import { cloneDeep, each, fromPairs } from 'lodash'

function getTime(date: any) {
  const m = moment(date)
  return `${m.locale('ru').format('L')} ${m.locale('ru').format('LTS')}`
}

@Module({
  namespaced: true,
  name: 'orders'
})
export default class Orders extends VuexModule {
  public orders: Array<any> | null = null
  public countRows = 0

  get ordersTable() {
    return map(this.orders, (e) => {
      const closeTime = getTime(e.estimatedCloseAt)
      const createTime = getTime(e.createdAt)

      return {
        id: e.id,
        estimatedCloseAt: closeTime,
        status: e.status,
        created: createTime,
        phoneModel: e.phoneModel,
        phoneBrand: e.phoneBrand,
        password: e.password
      }
    })
  }

  @Mutation
  SET_ORDERS(payload: any) {
    this.orders = payload.docs
    this.countRows = payload.totalDocs
  }

  @Action
  async fetch(payload: any) {
    const office = settingsModule.office?._id
    const query: any = {
      page: payload.page,
      limit: payload.itemsPerPage,
      office
    }

    const sortDesc = map(payload.sortDesc, (e) => (e ? 'desc' : 'asc'))

    query.sort = fromPairs(zip(payload.sortBy, sortDesc))

    const filters = cloneDeep(payload.columnFilters)
    if (filters) {
      query.filter = filters
    }

    this.context.commit('SET_ORDERS', await ordersAPI().getPaginated(query))
  }

  @Action
  async getOrder(id: number | string) {
    return await ordersAPI(id).getById()
  }

  @Action
  async createOrder(payload: any) {
    try {
      const response = await ordersAPI().create(payload)

      if (response) {
        return true
      } else {
        return false
      }
    } catch (error) {
      return false
    }
  }
}
