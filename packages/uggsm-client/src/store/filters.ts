import { VuexFilterList } from '@/typings/TokenFilter'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

@Module({
  namespaced: true,
  name: 'filters',
})
export default class Filters extends VuexModule {
  public filterList: VuexFilterList = {
    tests: {
      default: [],
      custom: [],
      current: [],
    },
  }

  @Mutation
  SET_OFFICE(payload: string) {
    this.office = payload
  }

  @Action
  async setSocketNotificationStatus(payload: boolean) {
    this.context.commit('SET_SOCKET_NOTIFICATION_STATUS', payload)
  }
}
