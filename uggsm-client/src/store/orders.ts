import { Order as OrderType } from '@/typings/api/order'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { ordersAPI } from '@/api'
import { map, zip } from 'lodash'

import moment from 'moment'
import { authModule, settingsModule } from '.'
import { fromPairs } from 'lodash'
import axios from '@/plugins/axios'

function getTime(date: any) {
  const m = moment(date)
  return `${m.format('DD.MM.YYYY')} ${m.format('HH:mm')}`
}

@Module({
  namespaced: true,
  name: 'orders',
})
export default class Orders extends VuexModule {
  public orders: Array<OrderType> | null = null
  public currentOrder: OrderType | null = null
  public isLoading = false
  public countRows = 0
  public options = {
    page: 1,
    itemsPerPage: 25,
    sortBy: ['id'],
    sortDesc: [true],
    mustSort: false,
    multiSort: true,
    hideClosed: true,
  }

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
        password: e.password,
        declaredDefect: e.declaredDefect,
        quick: e.quick,
      }
    })
  }

  @Mutation
  SET_LOADING(payload: boolean) {
    this.isLoading = payload
  }

  @Mutation
  SET_ORDERS(payload: any) {
    this.orders = payload.docs
    this.countRows = payload.totalDocs
  }

  @Mutation
  SET_ORDER(payload: any) {
    this.currentOrder = payload
  }

  @Mutation
  SET_OPTIONS(payload: any) {
    this.options = payload
  }

  @Mutation
  CLEAR_CURRENT_ORDER() {
    this.currentOrder = null
  }

  @Action
  setOptions(payload: any) {
    this.context.commit('SET_OPTIONS', payload)
  }

  @Action
  async fetch() {
    this.context.commit('SET_LOADING', true)
    const payload = this.options
    const office = settingsModule.office?._id
    const query: any = {
      page: payload.page,
      limit: payload.itemsPerPage,
      office,
      hideStatuses: [payload.hideClosed ? 'Закрыт' : ''],
    }

    if (settingsModule.search) {
      query.search = settingsModule.search
    }

    const sortDesc = map(payload.sortDesc, (e) => (e ? 'desc' : 'asc'))

    query.sort = fromPairs(zip(payload.sortBy, sortDesc))

    if (authModule.user?.role === 'master') {
      query.master = authModule.user._id
    }

    this.context.commit('SET_ORDERS', await ordersAPI().getPaginated(query))
    this.context.commit('SET_LOADING', false)
  }

  @Action
  async getOrder(id: number | string | undefined) {
    this.context.commit('SET_LOADING', true)
    this.context.commit('SET_ORDER', await ordersAPI(id).getById())
    this.context.commit('SET_LOADING', false)
  }

  @Action
  async clearOrder() {
    this.context.commit('CLEAR_CURRENT_ORDER')
  }

  @Action
  async socket_updateOrders() {
    this.fetch()
    console.log('updated orders by socket')
  }

  @Action
  async socket_updatedOrder(evt: OrderType) {
    if (this.currentOrder) {
      if (this.currentOrder.id == evt.id) {
        console.log('updated order ' + evt.id + ' by socket')
      }
    }
  }

  @Action
  async socket_updateOrder(evt: string | number) {
    if (this.currentOrder) {
      if (this.currentOrder.id == evt) {
        this.getOrder(evt)
        console.log('update order ' + evt + ' by socket')
      }
    }
  }

  @Action
  async generateReport(payload: any) {
    try {
      const response = await axios.get('/order/reports/report', { params: payload })

      return response.data
    } catch (e) {
      return false
    }
  }

  @Action
  async createOrder(payload: any) {
    this.context.commit('SET_LOADING', true)
    try {
      const response = await ordersAPI(payload.office).createByOffice(payload)

      if (response) {
        return true
      } else {
        return false
      }
    } catch (error) {
      return false
    } finally {
      this.context.commit('SET_LOADING', false)
    }
  }

  @Action
  async updateOrder(payload: any) {
    this.context.commit('SET_LOADING', true)
    try {
      const response = await ordersAPI(payload.id).updateById(payload.order)

      if (response) {
        return true
      } else {
        return false
      }
    } catch (error) {
      return false
    } finally {
      this.context.commit('SET_LOADING', false)
    }
  }
}
