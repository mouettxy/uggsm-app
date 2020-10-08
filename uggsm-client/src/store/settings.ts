import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { cashModule, officesModule, ordersModule } from '.'

@Module({
  namespaced: true,
  name: 'settings',
})
export default class Settings extends VuexModule {
  public office: any = null

  @Mutation
  SET_OFFICE(payload: string) {
    this.office = payload
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
}
