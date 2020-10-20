import { fromPairs, map, zip } from 'lodash'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { settingsModule } from '.'
import { Client as ClientType } from '@/typings/api/client'
import { clientAPI } from '@/api'
import moment from 'moment'
@Module({
  namespaced: true,
  name: 'client',
})
export default class Client extends VuexModule {
  public clients: Array<ClientType> | null = null

  public isLoading = false
  public countRows = 0
  public options = {
    page: 1,
    itemsPerPage: 25,
    sortBy: ['id'],
    sortDesc: [true],
    mustSort: false,
    multiSort: true,
  }

  get clientTable() {
    return map(this.clients, (e) => {
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

  @Mutation
  SET_LOADING(payload: boolean) {
    this.isLoading = payload
  }

  @Mutation
  SET_CLIENTS(payload: any) {
    this.clients = payload.docs
    this.countRows = payload.totalDocs
  }

  @Mutation
  SET_OPTIONS(payload: any) {
    this.options = payload
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
    }

    if (settingsModule.search) {
      query.search = settingsModule.search
    }

    const sortDesc = map(payload.sortDesc, (e) => (e ? 'desc' : 'asc'))

    query.sort = fromPairs(zip(payload.sortBy, sortDesc))

    this.context.commit('SET_CLIENTS', await clientAPI().getPaginated(query))
    this.context.commit('SET_LOADING', false)
  }

  @Action
  async socket_updateClients() {
    this.fetch()
    console.log('update clients by socket')
  }
}
