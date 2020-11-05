import { Order as OrderType } from '@/typings/api/order'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { ordersAPI } from '@/api'
import { map, reduce } from 'lodash'

import moment from 'moment'
import { authModule } from '.'
import axios from '@/plugins/axios'
import { TableHelpers } from './helpers'

function getTime(date: any) {
  const m = moment(date)
  return `${m.format('DD.MM.YYYY')} ${m.format('HH:mm')}`
}

export type SendSMSInput = {
  id?: number | string
  type?: 'order-created' | 'order-closed' | 'order-closed-without-work' | 'message'
  phone: string
  model: string
  price?: number
  message?: string
}

@Module({
  namespaced: true,
  name: 'orders',
})
export default class Orders extends VuexModule {
  /* -------------------------------------------------------------------------- */
  /*                                    TABLE                                   */
  /* -------------------------------------------------------------------------- */

  public table: Array<OrderType> | null = null
  public isLoading = false
  public tableRows = 0
  public tableOptions: any = TableHelpers.generateOptions(1, 25, 'id', (options) => {
    return {
      ...options,
      status: [],
      excludeStatus: ['Закрыт'],
    }
  })
  public tableHeaders = TableHelpers.generateHeaders(
    {
      id: '№',
      estimatedCloseAt: 'Срок заказа',
      status: 'Статус',
      client: 'Клиент',
      created: 'Создан',
      phoneBrand: 'Бренд',
      phoneModel: 'Устройство',
      declaredDefect: 'Неисправность',
      totalWorks: 'Сумма работ',
      password: 'Пароль',
      notifications: 'Уведомления',
      adversitement: 'Рекламная кампания',
    },
    'orders-headers'
  )
  get tableItems() {
    return map(this.table, (e) => {
      const closeTime = getTime(e.estimatedCloseAt)
      const createTime = getTime(e.createdAt)
      const totalWorks = reduce(
        e.statusWork,
        (a, el) => {
          a += el.price
          return a
        },
        0
      )

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
        client: e.customerName,
        clientId: e.customer ? e.customer.id : false,
        totalWorks,
      }
    })
  }
  get tableHeadersFormatted() {
    return TableHelpers.excludeNotShownHeaders(this.tableHeaders)
  }
  @Mutation
  SET_LOADING(payload: boolean) {
    this.isLoading = payload
  }
  @Mutation
  SET_TABLE(payload: any) {
    this.table = payload.docs
    this.tableRows = payload.totalDocs
  }
  @Mutation
  SET_TABLE_OPTIONS(payload: any) {
    this.tableOptions = payload
  }
  @Mutation
  SET_TABLE_HEADERS(payload: any) {
    this.tableHeaders = payload
  }
  @Action
  setTableOptions(payload: any) {
    this.context.commit('SET_TABLE_OPTIONS', payload)
  }
  @Action
  setTableHeaders(payload: any) {
    localStorage.setItem('orders-headers', JSON.stringify(payload))
    this.context.commit('SET_TABLE_HEADERS', payload)
  }
  @Action
  async fetchTable() {
    this.context.commit('SET_LOADING', true)

    const response = await ordersAPI().getPaginated(
      TableHelpers.processQuery(this.tableOptions, (query) => {
        const query_: any = {
          statuses: this.tableOptions.status,
          excludeStatuses: this.tableOptions.excludeStatus,
        }

        if (authModule.user?.role === 'master') {
          query_.master = authModule.user._id
        }

        return {
          ...query,
          ...query_,
        }
      })
    )

    this.context.commit('SET_TABLE', response)
    this.context.commit('SET_LOADING', false)
  }

  @Action
  async getOrder(id: number | string | undefined): Promise<OrderType> {
    this.context.commit('SET_LOADING', true)
    const response = await ordersAPI(id).getById()
    this.context.commit('SET_LOADING', false)
    return response
  }
  /* -------------------------------------------------------------------------- */
  /*                                   SOCKETS                                  */
  /* -------------------------------------------------------------------------- */

  @Action
  async socket_updateOrders() {
    this.fetchTable()
    console.log('updated orders by socket')
  }

  /* @Action
  async socket_updatedOrder(evt: OrderType) {
    if (this.currentOrder) {
      if (this.currentOrder.id == evt.id) {
        console.log('updated order ' + evt.id + ' by socket')
      }
    }
  } */

  /* @Action
  async socket_updateOrder(evt: string | number) {
    if (this.currentOrder) {
      if (this.currentOrder.id == evt) {
        this.getOrder(evt)
        console.log('update order ' + evt + ' by socket')
      }
    }
  } */

  /* -------------------------------------------------------------------------- */
  /*                                     API                                    */
  /* -------------------------------------------------------------------------- */

  @Action
  async generateReport(payload: any & { type: string }) {
    try {
      const response = await axios.get('/order/reports/report', { params: payload })

      return response.data
    } catch (e) {
      return false
    }
  }

  @Action
  async sendSms(payload: SendSMSInput) {
    try {
      if (!payload.type) {
        payload.type = 'message'
      }

      const response = await axios.put(`/order/${payload.id}/sms`, payload)

      if (response.status === 200) {
        return true
      } else {
        return false
      }
    } catch (error) {
      return false
    }
  }

  @Action
  async sendSmsOnCreated(payload: SendSMSInput) {
    return await this.context.dispatch('sendSms', {
      ...payload,
      type: 'order-created',
    })
  }

  @Action
  async sendSmsOnClosed(payload: SendSMSInput) {
    return await this.context.dispatch('sendSms', {
      ...payload,
      type: 'order-closed',
    })
  }

  @Action
  async sendSmsOnClosedWithoutWork(payload: SendSMSInput) {
    return await this.context.dispatch('sendSms', {
      ...payload,
      type: 'order-closed-without-work',
    })
  }

  @Action
  async createOrder(payload: any) {
    this.context.commit('SET_LOADING', true)
    try {
      const response = await ordersAPI(payload.office).createByOffice(payload)

      if (response) {
        return response
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
