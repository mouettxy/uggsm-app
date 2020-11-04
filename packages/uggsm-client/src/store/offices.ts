import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { officeAPI } from '@/api'
import find from 'lodash/find'

@Module({
  namespaced: true,
  name: 'offices',
})
export default class Offices extends VuexModule {
  public offices: Array<any> | null = null

  @Mutation
  SET_OFFICES(payload: Array<any>) {
    this.offices = payload
  }

  @Action
  async fetch() {
    this.context.commit('SET_OFFICES', await officeAPI().getAll())
  }

  @Action
  async socket_updateOffices() {
    this.fetch()
    console.log('update offices by socket')
  }

  @Action
  findByCodeAndName(payload: string) {
    const code = payload.split('|')[0]
    return find(this.offices, { code })
  }
}
