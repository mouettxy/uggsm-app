import { TableHelpers } from './helpers/index'
import { fromPairs, map, zip } from 'lodash'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { settingsModule } from '.'
import { Client as ClientType } from '@/typings/api/client'
import { clientAPI } from '@/api'
import moment from 'moment'
import axios from '@/plugins/axios'
@Module({
  namespaced: true,
  name: 'client',
})
export default class Client extends VuexModule {
  /* -------------------------------------------------------------------------- */
  /*                                    TABLE                                   */
  /* -------------------------------------------------------------------------- */

  public table: Array<ClientType> | null = null
  public isLoading = false
  public tableRows = 0
  public tableOptions: any = TableHelpers.generateOptions(1, 25, 'id')
  public tableHeaders = TableHelpers.generateHeaders(
    {
      id: '№',
      name: 'Имя',
      email: 'Почта',
      phone: 'Телефон',
      address: 'Адрес',
      createdAt: 'Создано',
      notifications: 'Уведомления',
    },
    'clients-headers'
  )
  get tableItems() {
    return map(this.table, (e) => {
      return {
        id: e.id,
        createdAt: moment(e.createdAt).format('DD MMMM YYYY HH:mm'),
        isProvider: e.isProvider,
        isConflict: e.isConflict,
        address: e.address,
        name: e.name,
        email: e.email,
        notifications: {
          email: e.allowedEmailNotifications,
          sms: e.allowedNotifications,
        },
        type: e.clientType,
        phone: e.phone,
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
    localStorage.setItem('cashes-headers', JSON.stringify(payload))
    this.context.commit('SET_TABLE_HEADERS', payload)
  }
  @Action
  async fetchTable() {
    this.context.commit('SET_LOADING', true)

    const response = await clientAPI().getPaginated(TableHelpers.processQuery(this.tableOptions))

    this.context.commit('SET_TABLE', response)
    this.context.commit('SET_LOADING', false)
  }

  @Action
  async getOneById(id: number | string) {
    try {
      const response = await axios.get(`/client/${id}`)

      if (response.status === 200) {
        return response.data
      } else {
        return false
      }
    } catch (error) {
      return false
    }
  }

  @Action
  async getOneByName(name: string) {
    try {
      const response = await axios.get(`/client/name/${name}`)

      if (response.status === 200) {
        return response.data
      } else {
        return false
      }
    } catch (error) {
      return false
    }
  }

  @Action
  async create(payload: ClientType) {
    try {
      const response = await axios.post(`/client/`, payload)

      if (response.status === 200) {
        return response.data
      } else {
        return false
      }
    } catch (error) {
      return false
    }
  }

  @Action
  async updateById(payload: ClientType) {
    try {
      const response = await axios.put(`/client/${payload.id}`, payload)

      if (response.status === 200) {
        return response.data
      } else {
        return false
      }
    } catch (error) {
      return false
    }
  }

  @Action
  async deleteById(id: number | string) {
    try {
      const response = await axios.delete(`/client/${id}`)

      if (response.status === 200) {
        return response.data
      } else {
        return false
      }
    } catch (error) {
      return false
    }
  }

  @Action
  async socket_updateClients() {
    this.fetchTable()
  }
}
