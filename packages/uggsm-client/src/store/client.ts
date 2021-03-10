import { TableHelpers } from './helpers/index'
import { map } from 'lodash'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { Client as ClientType } from '@/typings/api/client'
import ClientAPI from '@/api/client'
import moment from 'moment'
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

    const response = await ClientAPI.getPaginated(TableHelpers.processQuery(this.tableOptions))

    this.context.commit('SET_TABLE', response.data)
    this.context.commit('SET_LOADING', false)
  }

  @Action
  async socket_updateClients() {
    this.fetchTable()
  }
}
