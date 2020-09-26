import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { officesModule } from '.'

@Module({
  namespaced: true,
  name: 'settings'
})
export default class Settings extends VuexModule {
  public office: any = null

  @Mutation
  SET_OFFICE(payload: string) {
    this.office = payload
  }

  @Action
  async setOffice(payload: string) {
    this.context.commit('SET_OFFICE', await officesModule.findByCodeAndName(payload))
  }
}
