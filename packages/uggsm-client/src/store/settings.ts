import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
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
}
