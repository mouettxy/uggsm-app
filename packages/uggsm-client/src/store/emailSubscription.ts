import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import axios from '@/plugins/axios'
import { filter, map } from 'lodash'

@Module({
  namespaced: true,
  name: 'emailSubscription',
})
export default class EmailSubscription extends VuexModule {
  public dailySubscriptions: any = null

  @Mutation
  SET_DAILY_SUBSCRIPTIONS(payload: any) {
    this.dailySubscriptions = payload
  }

  @Action
  async fetchDailySubscriptions() {
    try {
      const response = await axios.get('/email-subscriptions')

      if (response.status === 200) {
        this.context.commit('SET_DAILY_SUBSCRIPTIONS', filter(response.data, { type: 'daily-report' }))
      } else {
        this.context.commit('SET_DAILY_SUBSCRIPTIONS', null)
      }
    } catch (error) {
      this.context.commit('SET_DAILY_SUBSCRIPTIONS', null)
    }
  }

  @Action
  async createDailySubscription(email: string) {
    try {
      const response = await axios.post('/email-subscriptions', {
        type: 'daily-report',
        email,
      })

      if (response.status === 200) {
        return response.data
      } else {
        return false
      }
    } catch (error) {
      return false
    }
  }

  @Action
  async deleteSubscription(id: string) {
    try {
      const response = await axios.delete('/email-subscriptions/' + id)

      if (response.status === 200) {
        return response.data
      } else {
        return false
      }
    } catch (error) {
      return false
    }
  }

  @Action
  async socket_updateEmailSubscriptions() {
    this.fetchDailySubscriptions()
  }
}
