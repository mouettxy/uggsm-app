import { RoleModel } from '../models/roleModel'
import { IRolesController } from '../interfaces/IRoleController'
import { ControllerMethod } from '../interfaces/controller'
import { api } from '../server'
import BaseController from './base/BaseController'
import { filter, find, findIndex } from 'lodash'

enum Emits {
  ROLE_CREATED = 'role created',
  ROLE_UPDATED = 'role updated',
  ROLE_DELETED = 'role deleted',
  ABILITY_CREATED = 'ability created',
  ABILITY_UPDATED = 'ability updated',
  ABILTIY_DELETED = 'ability deleted',

  ROLES_UPDATED = 'roles updated',
}

type RoleAbility = {
  value: string
  name: string
  description: string
  operator: string
  type: string
  autocomplete: string
}

type Role = {
  value: string
  name: string
  description: string
  abilities: RoleAbility[]
}

export class RolesController extends BaseController implements IRolesController {
  private model = RoleModel

  public Emits = Emits

  public get: ControllerMethod = async (req, res, next) => {
    try {
      const roles = await this.model.find()

      this.success(res, roles)
    } catch (error) {
      this.criticalError(next, error)
    }
  }

  public getOne: ControllerMethod = async (req, res, next) => {
    const role = req.params.role
    try {
      const document = await this.model.findOne({ value: role })

      this.success(res, document)
    } catch (error) {
      this.criticalError(next, error)
    }
  }

  public create: ControllerMethod = async (req, res, next) => {
    const newRoleFields: Role = req.body

    const defaultAbilities = []

    newRoleFields.abilities = defaultAbilities

    try {
      const document = await this.model.create(newRoleFields)

      api.io.emit(this.Emits.ROLE_CREATED, document)
      api.io.emit(this.Emits.ROLES_UPDATED)

      this.success(res, document)
    } catch (error) {
      this.criticalError(next, error)
    }
  }

  public update: ControllerMethod = async (req, res, next) => {
    const role = req.params.role

    const roleFieldsToUpdate: Partial<Role> = req.body

    try {
      const document = await this.model.findOneAndUpdate({ value: role }, roleFieldsToUpdate)

      api.io.emit(this.Emits.ROLE_UPDATED, document)
      api.io.emit(this.Emits.ROLES_UPDATED)

      this.success(res, document)
    } catch (error) {
      this.criticalError(next, error)
    }
  }

  public delete: ControllerMethod = async (req, res, next) => {
    const role = req.params.role

    try {
      const document = await this.model.findOneAndDelete({ value: role })

      api.io.emit(this.Emits.ROLE_DELETED, document)
      api.io.emit(this.Emits.ROLES_UPDATED)

      this.success(res, document)
    } catch (error) {
      this.criticalError(next, error)
    }
  }

  public createAbility: ControllerMethod = async (req, res, next) => {
    const role = req.params.role

    const newAbilityFields: RoleAbility = req.body

    try {
      const document = await this.model.findOne({ value: role })

      if (!find(document.abilities, { value: newAbilityFields.value })) {
        document.abilities.push(newAbilityFields)

        await document.save()

        api.io.emit(this.Emits.ABILITY_CREATED, document)
        api.io.emit(this.Emits.ROLES_UPDATED)

        this.success(res, document)
      } else {
        this.badRequest(next, `Способность с кодовым именем "${newAbilityFields.value}" уже существует`)
      }
    } catch (error) {
      this.criticalError(next, error)
    }
  }

  public updateAbility: ControllerMethod = async (req, res, next) => {
    const role = req.params.role
    const ability = req.params.ability

    const abilityFieldsToUpdate: Exclude<Partial<RoleAbility>, 'value'> = req.body

    try {
      const document = await this.model.findOne({ value: role })

      const indexOfAbilityToUpdate = findIndex(document.abilities, { value: ability })

      for (const field in abilityFieldsToUpdate) {
        document.abilities[indexOfAbilityToUpdate][field] = abilityFieldsToUpdate[field]
      }

      await document.save()

      api.io.emit(this.Emits.ABILITY_UPDATED, document)
      api.io.emit(this.Emits.ROLES_UPDATED)

      this.success(res, document)
    } catch (error) {
      this.criticalError(next, error)
    }
  }

  public deleteAbility: ControllerMethod = async (req, res, next) => {
    const role = req.params.role
    const ability = req.params.ability as string

    try {
      const document = await this.model.findOne({ value: role })

      document.abilities = filter(document.abilities, (e) => e.value !== ability)

      await document.save()

      api.io.emit(this.Emits.ABILTIY_DELETED, document)
      api.io.emit(this.Emits.ROLES_UPDATED)

      this.success(res, document)
    } catch (error) {
      this.criticalError(next, error)
    }
  }
}
