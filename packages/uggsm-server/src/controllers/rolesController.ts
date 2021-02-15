import { RoleModel } from '../models/roleModel'
import { IRolesController } from '../interfaces/IRoleController'
import { ControllerMethod } from '../interfaces/controller'
import { api } from '../server'
import BaseController from './base/BaseController'
import { filter, find, findIndex } from 'lodash'

export class RolesController extends BaseController implements IRolesController {
  private model = RoleModel

  public get: ControllerMethod = async (req, res, next) => {
    try {
      const roles = await this.model.find()

      this.success(res, roles)
    } catch (error) {
      this.criticalError(next, error)
    }
  }

  public getByName: ControllerMethod = async (req, res, next) => {
    try {
      const name = req.params.name

      const role = await this.model.findOne({ name })

      this.success(res, role)
    } catch (error) {
      this.criticalError(next, error)
    }
  }

  public create: ControllerMethod = async (req, res, next) => {
    try {
      let data
      if (req.body.resources) {
        data = req.body
      } else {
        data = {
          ...req.body,
          resources: [],
        }
      }

      const role = await this.model.create(data)

      await role.save()

      api.io.emit('role created', role)
      api.io.emit('update roles')

      this.success(res, role)
    } catch (error) {
      this.criticalError(next, error)
    }
  }

  public delete: ControllerMethod = async (req, res, next) => {
    try {
      const name = req.params.name

      await this.model.findOneAndRemove({ name })

      api.io.emit('role deleted', name)
      api.io.emit('update roles', name)

      this.success(res, 'OK')
    } catch (error) {
      this.criticalError(next, error)
    }
  }

  public update: ControllerMethod = async (req, res, next) => {
    try {
      const name = req.params.name
      const data = req.body.data

      const role = await this.model.findOneAndUpdate({ name }, data)

      this.success(res, role)
    } catch (error) {
      this.criticalError(next, error)
    }
  }

  public createResource: ControllerMethod = async (req, res, next) => {
    try {
      const name = req.params.name
      const resource = {
        name: req.body.name,
        description: req.body.description,
      }

      const role = await this.model.findOne({ name })

      if (find(role.resources, { name: resource.name })) {
        this.badRequest(next, 'Ресурс с таким названием уже существует')
      } else {
        role.resources.push({
          ...resource,
          abilities: [
            {
              name: 'access',
              description: 'Доступ к ресурсу',
              value: true,
            },
          ],
        })

        await role.save()

        api.io.emit('resource created', role)
        api.io.emit('update roles', name)

        this.success(res, role)
      }
    } catch (error) {
      this.criticalError(next, error)
    }
  }

  public deleteResource: ControllerMethod = async (req, res, next) => {
    try {
      const name = req.params.name
      const resource = req.body.resource

      const role = await this.model.findOne({ name })

      role.resources = filter(role.resources, (e) => e.name !== resource)

      await role.save()

      api.io.emit('resource deleted', role)
      api.io.emit('update roles', name)

      this.success(res, role)
    } catch (error) {
      this.criticalError(next, error)
    }
  }

  public createAbility: ControllerMethod = async (req, res, next) => {
    try {
      const name = req.params.name
      const resource = req.body.resource
      const ability = req.body.ability as { name: string; description: string }

      const role = await this.model.findOne({ name })

      const roleResource = find(role.resources, { name: resource })

      if (find(roleResource.abilities, { name: ability.name })) {
        this.badRequest(next, 'Способность с таким названием уже существует')
      } else {
        roleResource.abilities.push({
          ...ability,
          value: true,
        })

        await role.save()

        api.io.emit('ability created', role)
        api.io.emit('update roles', name)

        this.success(res, role)
      }
    } catch (error) {
      this.criticalError(next, error)
    }
  }

  public deleteAbility: ControllerMethod = async (req, res, next) => {
    try {
      const name = req.params.name
      const resource = req.body.resource
      const ability = req.body.ability

      const role = await this.model.findOne({ name })

      const roleResource = find(role.resources, { name: resource })

      roleResource.abilities = filter(roleResource.abilities, (e) => e.name !== ability)

      await role.save()

      api.io.emit('ability deleted', role)
      api.io.emit('update roles', name)

      this.success(res, role)
    } catch (error) {
      this.criticalError(next, error)
    }
  }

  public updateAbility: ControllerMethod = async (req, res, next) => {
    try {
      const name = req.params.name
      const resource = req.body.resource
      const ability = req.body.ability as { name: string; description: string; value: boolean }

      const role = await this.model.findOne({ name })

      const roleResource = find(role.resources, { name: resource })

      const resourceAbility = find(roleResource.abilities, { name: ability.name })

      resourceAbility.name = ability.name
      resourceAbility.description = ability.description
      resourceAbility.value = ability.value

      await role.save()

      api.io.emit('ability updated', role)
      api.io.emit('update roles', name)

      this.success(res, role)
    } catch (error) {
      this.criticalError(next, error)
    }
  }

  public createField: ControllerMethod = async (req, res, next) => {
    try {
      const { role, resource, ability, field } = req.params

      const fieldData: {
        description: string
        name: string
        value: Array<string> | boolean | string
        settings: {
          operator: '=' | '!=' | 'in' | '!in'
          type: 'array' | 'string' | 'boolean'
        }
      } = req.body

      const model = await this.model.findOne({ name: role })

      const modelResource = find(model.resources, { name: resource })

      const modelAbility = find(modelResource.abilities, { name: ability })

      if (!Array.isArray(modelAbility.fields)) {
        modelAbility.fields = []
      }

      if (find(modelAbility.fields, { name: field })) {
        this.badRequest(next, 'Поле с таким названием уже существует')
      } else {
        modelAbility.fields.push(fieldData)

        await model.save()

        api.io.emit('field created', fieldData)
        api.io.emit('update roles', role)

        this.success(res, model)
      }
    } catch (error) {
      this.criticalError(next, error)
    }
  }

  public updateField: ControllerMethod = async (req, res, next) => {
    try {
      const { role, resource, ability, field } = req.params

      const fieldData: {
        description: string
        name: string
        value: Array<string> | boolean | string
        settings: {
          operator: '=' | '!=' | 'in' | '!in'
          type: 'array' | 'string' | 'boolean'
        }
      } = req.body

      const model = await this.model.findOne({ name: role })

      const modelResource = find(model.resources, { name: resource })

      const modelAbility = find(modelResource.abilities, { name: ability })

      const modelField = find(modelAbility?.fields, { name: field })

      if (modelField) {
        Object.assign(modelField, fieldData)

        model.save()

        api.io.emit('field updated', role)
        api.io.emit('update roles', role)

        this.success(res, model)
      } else {
        this.badRequest(next, 'Поля с таким названием не существует')
      }
    } catch (error) {
      this.criticalError(next, error)
    }
  }

  public deleteField: ControllerMethod = async (req, res, next) => {
    try {
      const { role, resource, ability, field } = req.params

      const model = await this.model.findOne({ name: role })

      const modelResource = find(model.resources, { name: resource })

      const modelAbility = find(modelResource.abilities, { name: ability })

      modelAbility.fields = filter(modelAbility.fields, (e) => e.name !== field)

      api.io.emit('field deleted', field)
      api.io.emit('update roles', role)

      this.success(res, model)
    } catch (error) {
      this.criticalError(next, error)
    }
  }
}
