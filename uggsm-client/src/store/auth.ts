import { User } from '@/typings/api/auth'
import { authAPI } from '@/api'
import { AuthInput } from '@/typings/api/auth'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

@Module({
  namespaced: true,
  name: 'auth',
})
export default class Auth extends VuexModule {
  public user: User | null = null
  public isLoggedIn = false

  @Mutation
  LOGIN(payload: User) {
    this.user = payload
    this.isLoggedIn = true
  }

  @Mutation
  LOGOUT() {
    this.user = null
    this.isLoggedIn = false
  }

  @Action
  async login(payload: AuthInput) {
    const response = await authAPI().login(payload)

    if (response) {
      this.context.commit('LOGIN', response)
      return Promise.resolve(true)
    } else {
      return Promise.resolve(false)
    }
  }

  @Action
  async logout() {
    const response = await authAPI().logout()

    if (response) {
      this.context.commit('LOGOUT')
      return Promise.resolve(true)
    } else {
      return Promise.resolve(false)
    }
  }

  @Action
  async register(payload: any) {
    const response = await authAPI().register(payload)

    if (response) {
      return Promise.resolve(true)
    } else {
      return Promise.resolve(false)
    }
  }

  @Action
  async socket_createdUser(evt: string) {
    //
  }

  @Action
  async socket_updatedUser(evt: User) {
    if (evt.id === this.user?.id) {
      this.context.commit('LOGIN', evt)
    }
  }

  @Action
  async socket_deletedUser(evt: string) {
    if (evt === this.user?._id) {
      this.context.commit('LOGOUT')
    }
  }
}
