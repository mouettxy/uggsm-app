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

  @Mutation
  SET_OFFICE(payload: string) {
    this.office = payload
  }

  @Mutation
  SET_SEARCH(payload: string) {
    this.search = payload
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
}
