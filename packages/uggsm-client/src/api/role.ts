import axios from 'axios'
import { config } from '@/plugins/axios'
import { AxiosResponseAPI } from '@/typings/api/helpers'
import { RoleAbility, Role, Roles, RoleInput, ResourceInput, AbilityInput } from '@/typings/api/role'

export class RoleAPI {
  private apiConfig = {
    ...config,
    baseURL: `${config.baseURL}/role`,
  }

  private api = axios.create(this.apiConfig)

  /**
   * Get all roles
   */
  async getAll(): AxiosResponseAPI<Roles> {
    try {
      const response = await this.api.get<Roles>('')

      return response
    } catch (error) {
      return error
    }
  }

  /**
   *
   * Get role by name
   *
   * @param name name of role
   */
  async getOne(name: string): AxiosResponseAPI<Role> {
    try {
      const response = await this.api.get<Role>(name)

      return response
    } catch (error) {
      return error
    }
  }

  /**
   *
   * Creates role
   *
   * @param data role fields without resources field
   */
  async create(data: RoleInput): AxiosResponseAPI<Role> {
    try {
      const response = await this.api.post<Role>('', data)

      return response
    } catch (error) {
      return error
    }
  }

  /**
   *
   * Partial update of role
   *
   * @param name name of role
   * @param data some of role fields that needs to be updated
   */
  async update(name: string, data: Partial<Role>): AxiosResponseAPI<Role> {
    try {
      const response = await this.api.put<Role>(name, data)

      return response
    } catch (error) {
      return error
    }
  }

  /**
   *
   * Deletes role
   *
   * @param name name of role
   */
  async delete(name: string): AxiosResponseAPI<string> {
    try {
      const response = await this.api.delete(name)

      return response
    } catch (error) {
      return error
    }
  }

  /**
   *
   * Creates resource on role
   *
   * @param name name of role
   * @param data resource fields withot abilities specified
   */
  async createResource(name: string, data: ResourceInput): AxiosResponseAPI<Role> {
    try {
      const response = await this.api.post<Role>(`${name}/resource`, data)

      return response
    } catch (error) {
      return error
    }
  }

  /**
   *
   * Deletes resource from role
   *
   * @param name name of role
   * @param resource name of resource
   */
  async deleteResource(name: string, resource: string): AxiosResponseAPI<Role> {
    try {
      const response = await this.api.request({
        url: `${name}/resource/`,
        method: 'delete',
        data: { resource },
      })

      return response
    } catch (error) {
      return error
    }
  }

  /**
   *
   * Creates ability
   *
   * @param name name of role
   * @param resource name of resource
   * @param ability ability fields without value field
   */
  async createAbility(name: string, resource: string, ability: AbilityInput): AxiosResponseAPI<Role> {
    try {
      const response = await this.api.post<Role>(`${name}/ability`, { resource, ability })

      return response
    } catch (error) {
      return error
    }
  }

  /**
   *
   * Complete update (basically rewrite) of ability
   *
   * @param name name of role
   * @param resource name of resource
   * @param ability fields of ability
   */
  async updateAbility(name: string, resource: string, ability: RoleAbility): AxiosResponseAPI<Role> {
    try {
      const response = await this.api.put<Role>(`${name}/ability`, { resource, ability })

      return response
    } catch (error) {
      return error
    }
  }

  /**
   *
   * Deletes ability from role
   *
   * @param name name of role
   * @param resource name of resource
   * @param ability name of ability
   */
  async deleteAbility(name: string, resource: string, ability: string): AxiosResponseAPI<Role> {
    try {
      const response = await this.api.request({
        url: `${name}/ability`,
        method: 'delete',
        data: { resource, ability },
      })

      return response
    } catch (error) {
      return error
    }
  }
}

export default new RoleAPI()
