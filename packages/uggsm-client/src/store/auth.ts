import { LOCAL_STORAGE } from '@/api/helpers/Constants'
import { User } from '@/typings/api/auth'
import { authAPI } from '@/api'
import { AuthInput } from '@/typings/api/auth'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import Vue from 'vue'
import router from '@/router'
import { tryUpdateRoleAbilities } from '@/plugins/casl'

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

    localStorage.setItem(LOCAL_STORAGE.CURRENT_ROLE, payload.role)
  }

  @Mutation
  LOGOUT() {
    this.user = null
    this.isLoggedIn = false

    localStorage.removeItem(LOCAL_STORAGE.CURRENT_ROLE)
  }

  @Action
  async login(payload: AuthInput) {
    const response = await authAPI().login(payload)

    if (response) {
      Vue.$cookies.set('UUID', response.jwtData.token, '7d')

      this.context.commit('LOGIN', response.user)

      await tryUpdateRoleAbilities(response.user.role)

      return Promise.resolve(true)
    } else {
      return Promise.resolve(false)
    }
  }

  @Action
  async logout(reason?: string) {
    let response

    if (reason === 'rejected') {
      response = await authAPI().logout({ id: this.user?._id, token: null })
      if (router.currentRoute.name !== 'login') {
        router.push({ name: 'login' })
      }
    } else {
      response = await authAPI().logout({ id: this.user?._id, token: Vue.$cookies.get('UUID') })
    }

    if (response) {
      this.context.commit('LOGOUT')
      Vue.$cookies.remove('UUID')
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
  async socket_userUpdated(evt: User) {
    if (evt.id === this.user?.id) {
      this.context.commit('LOGIN', evt)

      await tryUpdateRoleAbilities(evt.role)
    }
  }

  @Action
  async socket_userDeleted(evt: string) {
    if (evt === this.user?._id) {
      this.context.commit('LOGOUT')
    }
  }
}
