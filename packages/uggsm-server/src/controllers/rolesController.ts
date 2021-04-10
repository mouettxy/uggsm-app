import { RoleModel } from '../models/roleModel'
import { IRolesController } from '../interfaces/IRoleController'
import { ControllerMethod } from '../interfaces/controller'
import { api } from '../server'
import { BaseController } from '../base/Controller'
import { filter, find, findIndex, includes } from 'lodash'

enum Emits {
  ROLE_CREATED = 'role created',
  ROLE_UPDATED = 'role updated',
  ROLE_DELETED = 'role deleted',
  ABILITY_CREATED = 'role ability created',
  ABILITY_UPDATED = 'role ability updated',
  ABILTIY_DELETED = 'role ability deleted',

  ROLES_UPDATED = 'roles updated',
}

type RoleAbility = {
  value: string | boolean | Array<string>
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

  private static = {
    defaultAbilities: [
      {
        value: [],
        name: 'access',
        description: 'Доступ к ссылкам',
        operator: 'not in array',
        type: 'array',
        autocomplete: 'access-links-list',
      },
      {
        value: true,
        name: 'createOrder',
        description: 'Создавать заявки',
        operator: 'equals',
        type: 'boolean',
        autocomplete: '',
      },
      {
        value: true,
        name: 'editOrder',
        description: 'Редактировать заявки',
        operator: 'equals',
        type: 'boolean',
        autocomplete: '',
      },
      {
        value: true,
        name: 'createGuarantyOrder',
        description: 'Создавать гарантийные заявки',
        operator: 'equals',
        type: 'boolean',
        autocomplete: '',
      },
      {
        value: true,
        name: 'editOrderManager',
        description: 'Редактировать менеджера заявки',
        operator: 'equals',
        type: 'boolean',
        autocomplete: '',
      },
      {
        value: true,
        name: 'addOrderWork',
        description: 'Добавлять работу к заявке',
        operator: 'equals',
        type: 'boolean',
        autocomplete: '',
      },
      {
        value: true,
        name: 'deleteOrderWork',
        description: 'Удалять работу из заявки',
        operator: 'equals',
        type: 'boolean',
        autocomplete: '',
      },
      {
        value: true,
        name: 'addOrderIncome',
        description: 'Добавлять приход к заявке',
        operator: 'equals',
        type: 'boolean',
        autocomplete: '',
      },
      {
        value: true,
        name: 'addOrderConsumption',
        description: 'Добавлять расход к заявке',
        operator: 'equals',
        type: 'boolean',
        autocomplete: '',
      },
      {
        value: true,
        name: 'editOrderStatus',
        description: 'Редактировать статус заявки',
        operator: 'equals',
        type: 'boolean',
        autocomplete: '',
      },
      {
        value: true,
        name: 'editOrderOffice',
        description: 'Менять офис заявки',
        operator: 'equals',
        type: 'boolean',
        autocomplete: '',
      },
      {
        value: true,
        name: 'editOrderMaster',
        description: 'Редактировать исполнителя заявки',
        operator: 'equals',
        type: 'boolean',
        autocomplete: '',
      },
      {
        value: true,
        name: 'editClient',
        description: 'Редактировать клиентов',
        operator: 'equals',
        type: 'boolean',
        autocomplete: '',
      },
      {
        value: true,
        name: 'addClientPhone',
        description: 'Добавлять телефон клиенту',
        operator: 'equals',
        type: 'boolean',
        autocomplete: '',
      },
      {
        value: true,
        name: 'deleteClientPhone',
        description: 'Удалять телефон клиента',
        operator: 'equals',
        type: 'boolean',
        autocomplete: '',
      },
      {
        value: true,
        name: 'addCashIncome',
        description: 'Добавлять приход в кассе',
        operator: 'equals',
        type: 'boolean',
        autocomplete: '',
      },
      {
        value: true,
        name: 'addCashConsumption',
        description: 'Добавлять расход в кассе',
        operator: 'equals',
        type: 'boolean',
        autocomplete: '',
      },
      {
        value: true,
        name: 'listenCalls',
        description: 'Может прослушивать звонки',
        operator: 'equals',
        type: 'boolean',
        autocomplete: '',
      },
      {
        value: ['Гаврилова', 'Гоголя', 'Ставропольская', 'UGGSM', 'iMarket Брюховецкая'],
        name: 'seeOffices',
        description: 'Видит заявки из офисов',
        operator: 'in array',
        type: 'array',
        autocomplete: 'offices',
      },
    ],
    types: [
      {
        text: 'Логическое значение',
        value: 'boolean',
      },
      {
        text: 'Строка',
        value: 'string',
      },
      {
        text: 'Список строк',
        value: 'array',
      },
    ],
    operators: [
      {
        text: 'Равно',
        value: 'equals',
      },
      {
        text: 'Не равно',
        value: 'not equals',
      },
      {
        text: 'В списке',
        value: 'in array',
      },
      {
        text: 'Не в списке',
        value: 'not in array',
      },
    ],
  }

  public Emits = Emits

  public getStatic: ControllerMethod = async (req, res, next) => {
    const requestedStatic = req.params.type

    if (includes(Object.keys(this.static), requestedStatic)) {
      this.success(res, this.static[requestedStatic])
    } else {
      this.success(res, [])
    }
  }

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

    const defaultAbilities = this.static.defaultAbilities

    newRoleFields.abilities = defaultAbilities

    try {
      const document = await this.model.create(newRoleFields)

      api.io.emit(this.Emits.ROLE_CREATED, document)
      api.io.emit(this.Emits.ROLES_UPDATED, newRoleFields.value)

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
      api.io.emit(this.Emits.ROLES_UPDATED, role)

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
      api.io.emit(this.Emits.ROLES_UPDATED, role)

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

      if (!find(document.abilities, { name: newAbilityFields.name })) {
        document.abilities.push(newAbilityFields)

        await document.save()

        api.io.emit(this.Emits.ABILITY_CREATED, document)
        api.io.emit(this.Emits.ROLES_UPDATED, role)

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

    const abilityFieldsToUpdate: Partial<RoleAbility> = req.body

    try {
      const document = await this.model.findOne({ value: role })

      const indexOfAbilityToUpdate = findIndex(document.abilities, { name: ability })

      for (const field in abilityFieldsToUpdate) {
        document.abilities[indexOfAbilityToUpdate][field] = abilityFieldsToUpdate[field]
      }

      await document.save()

      api.io.emit(this.Emits.ABILITY_UPDATED, document)
      api.io.emit(this.Emits.ROLES_UPDATED, role)

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

      document.abilities = filter(document.abilities, (e) => e.name !== ability)

      await document.save()

      api.io.emit(this.Emits.ABILTIY_DELETED, document)
      api.io.emit(this.Emits.ROLES_UPDATED, role)

      this.success(res, document)
    } catch (error) {
      this.criticalError(next, error)
    }
  }
}
