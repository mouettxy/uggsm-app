import { LOCAL_STORAGE } from '@/api/helpers/Constants'
import { AuthInput, User } from '@/typings/api/auth'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import Vue from 'vue'
import router from '@/router'
import { tryUpdateRoleAbilities } from '@/plugins/casl'
import VueRouter from 'vue-router'
const { isNavigationFailure, NavigationFailureType } = VueRouter
import AuthAPI from '@/api/auth'

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
    const response = await AuthAPI.login(payload)

    if (response.status !== 200) {
      return false
    }

    const user = response.data.user
    const jwtData = response.data.jwtData

    Vue.$cookies.set('UUID', jwtData.token, '7d')
    this.context.commit('LOGIN', user)

    await tryUpdateRoleAbilities(user.role)

    return true
  }

  @Action
  async logout(reason?: string) {
    let response

    if (reason === 'rejected') {
      response = await AuthAPI.logout({ id: this.user?._id, token: null })
      if (router.currentRoute.name !== 'login') {
        router.push({ name: 'login' }).catch((failure) => {
          if (isNavigationFailure(failure, NavigationFailureType.redirected)) {
            Vue.prototype.$notification.warning(
              'Ваша сессия закончена. Войдите в аккаунт снова что бы обновить сессию.'
            )
          }
        })
      }
    } else {
      response = await AuthAPI.logout({ id: this.user?._id, token: Vue.$cookies.get('UUID') })
    }

    if (response.status !== 200) {
      return false
    }

    this.context.commit('LOGOUT')
    Vue.$cookies.remove('UUID')

    router.push({ name: 'login' })

    return true
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
