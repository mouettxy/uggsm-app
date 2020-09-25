import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

@Module
export default class Offices extends VuexModule {
  public offices: Array<any> | null = null

  @Mutation
  SET_OFFICES(payload: Array<any>) {
    this.offices = payload
  }

  @Action
  fetch() {
    //
  }
}
