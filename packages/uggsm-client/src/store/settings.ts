import { sendRequest } from './../api/helpers/index'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { cashModule, clientModule, officesModule, ordersModule } from '.'

@Module({
  namespaced: true,
  name: 'settings',
})
export default class Settings extends VuexModule {
  public office: any = null
  public search: any = null
  public socketNotifications = true
  public miniNavigation: boolean | null = null

  @Mutation
  SET_OFFICE(payload: string) {
    this.office = payload
  }

  @Mutation
  SET_SEARCH(payload: string) {
    this.search = payload
  }

  @Mutation
  SET_SOCKET_NOTIFICATION_STATUS(payload: boolean) {
    this.socketNotifications = payload
  }

  @Mutation
  SET_MINI_NAVIGATION(payload: boolean | null) {
    this.miniNavigation = payload
  }

  @Action
  async setOffice(payload: { office: string; type: 'orders' | 'cash' }) {
    const office = await officesModule.findByCodeAndName(payload.office)

    this.context.commit('SET_OFFICE', office)

    if (payload.type === 'orders') {
      await ordersModule.fetchTable()
    } else if (payload.type === 'cash') {
      await cashModule.fetchTable()
    }
  }

  @Action
  async setSearch(payload: any) {
    this.context.commit('SET_SEARCH', payload.search)

    if (payload.type === 'orders') {
      ordersModule.fetchTable()
    } else if (payload.type === 'cash') {
      cashModule.fetchTable()
    } else if (payload.type === 'clients') {
      clientModule.fetch()
    }
  }

  @Action
  async setSocketNotificationStatus(payload: boolean) {
    this.context.commit('SET_SOCKET_NOTIFICATION_STATUS', payload)
  }

  @Action
  async setMiniNavigation(payload: boolean | null) {
    this.context.commit('SET_MINI_NAVIGATION', payload)
  }
}
