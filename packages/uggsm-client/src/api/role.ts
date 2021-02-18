import axios from 'axios'
import { config } from '@/plugins/axios'
import { AxiosResponseAPI } from '@/typings/api/helpers'
import { RoleAbility, Role, Roles, RoleInput, AbilityInput } from '@/typings/api/role'

export class RoleAPI {
  private apiConfig = {
    ...config,
    baseURL: `${config.baseURL}/role`,
  }

  private api = axios.create(this.apiConfig)

  async getStatic(type: string) {
    try {
      const response = await this.api.request<Array<Record<string, string>>>({
        url: `/static/${type}`,
        method: 'get',
      })

      return response
    } catch (error) {
      return error
    }
  }

  async getAll(): AxiosResponseAPI<Roles> {
    try {
      const response = await this.api.request<Roles>({
        url: ``,
        method: 'get',
      })

      return response
    } catch (error) {
      return error
    }
  }

  async getOne(name: string): AxiosResponseAPI<Role> {
    try {
      const response = await this.api.request<Role>({
        url: `${name}`,
        method: 'get',
      })

      return response
    } catch (error) {
      return error
    }
  }

  async create(data: RoleInput): AxiosResponseAPI<Role> {
    try {
      const response = await this.api.request<Role>({
        url: ``,
        method: 'post',
        data,
      })

      return response
    } catch (error) {
      return error
    }
  }

  async update(name: string, data: Partial<Role>): AxiosResponseAPI<Role> {
    try {
      const response = await this.api.request<Role>({
        url: `${name}`,
        method: 'put',
        data,
      })

      return response
    } catch (error) {
      return error
    }
  }

  async delete(name: string): AxiosResponseAPI<Role> {
    try {
      const response = await this.api.request<Role>({
        url: `${name}`,
        method: 'delete',
      })

      return response
    } catch (error) {
      return error
    }
  }

  async createAbility(name: string, data: AbilityInput): AxiosResponseAPI<Role> {
    try {
      const response = await this.api.request<Role>({
        url: `${name}/ability`,
        method: 'post',
        data,
      })

      return response
    } catch (error) {
      return error
    }
  }

  async updateAbility(name: string, ability: string, data: Partial<RoleAbility>): AxiosResponseAPI<Role> {
    try {
      const response = await this.api.request<Role>({
        url: `${name}/ability/${ability}`,
        method: 'put',
        data,
      })

      return response
    } catch (error) {
      return error
    }
  }

  async deleteAbility(name: string, ability: string): AxiosResponseAPI<Role> {
    try {
      const response = await this.api.request<Role>({
        url: `${name}/ability/${ability}`,
        method: 'delete',
      })

      return response
    } catch (error) {
      return error
    }
  }
}

export default new RoleAPI()
