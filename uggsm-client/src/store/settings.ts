import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { cashModule, clientModule, officesModule, ordersModule } from '.'

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
  async setOffice(payload: { office: string; type: 'orders' | 'cash' }) {
    const office = await officesModule.findByCodeAndName(payload.office)
    this.context.commit('SET_OFFICE', office)
    if (payload.type === 'orders') {
      await ordersModule.fetch()
    } else if (payload.type === 'cash') {
      await cashModule.fetch()
    }
  }

  @Action
  async setSearch(payload: any) {
    this.context.commit('SET_SEARCH', payload.search)

    if (payload.type === 'orders') {
      ordersModule.fetch()
    } else if (payload.type === 'cash') {
      cashModule.fetch()
    } else if (payload.type === 'clients') {
      clientModule.fetch()
    }
  }
}
