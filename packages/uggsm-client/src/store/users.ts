import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import axios from '@/plugins/axios'
import { User } from '@/typings/api/auth'

@Module({
  namespaced: true,
  name: 'users',
})
export default class Users extends VuexModule {
  @Action
  async getAll(): Promise<User[] | []> {
    try {
      const response = await axios.get('/user')

      if (response.status === 200) {
        return response.data
      } else {
        return []
      }
    } catch (error) {
      console.error(error)
      return []
    }
  }

  @Action
  async updateById(data: { id: string; payload: Partial<User> }) {
    try {
      const response = await axios.put(`/user/${data.id}`, data.payload)

      if (response.status === 200) {
        return response.data
      } else {
        return []
      }
    } catch (error) {
      console.error(error)
      return []
    }
  }
}
