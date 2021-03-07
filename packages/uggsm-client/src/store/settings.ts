import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { cashModule, clientModule, officesModule, ordersModule } from '.'
import Vue from 'vue'
import { Office } from '@/typings/api/office'
@Module({
  namespaced: true,
  name: 'settings',
})
export default class Settings extends VuexModule {
  public office: any = null
  public search: any = null
  public socketNotifications = true
  public miniNavigation: boolean | null = null

  public serverReconnect = false

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

  @Mutation
  SET_SERVER_RECONNECT(payload: boolean) {
    this.serverReconnect = payload
  }

  @Action
  async setOffice(payload: Office) {
    this.context.commit('SET_OFFICE', payload)
  }

  @Action
  async setSearch(payload: any) {
    this.context.commit('SET_SEARCH', payload.search)

    if (payload.type === 'orders') {
      ordersModule.fetchTable()
    } else if (payload.type === 'cash') {
      cashModule.fetchTable()
    } else if (payload.type === 'clients') {
      clientModule.fetchTable()
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

  @Action
  async socket_disconnect(reason: string) {
    if (reason === 'transport close') {
      Vue.prototype.$notification.warning('Происходит перезагрузка сервера...')

      this.context.commit('SET_SERVER_RECONNECT', true)
    }
  }

  @Action
  async socket_connect() {
    if (this.serverReconnect) {
      Vue.prototype.$notification.success('Сервер перезагружен. Рекомендуем обновить страницу.')
      this.context.commit('SET_SERVER_RECONNECT', false)
    }
  }
}
