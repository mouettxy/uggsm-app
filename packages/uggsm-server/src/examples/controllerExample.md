# Controller Example

New controller version

```ts
import { ControllerMethod } from '../interfaces'
import { BaseController } from '../base'
import { ExampleService, exampleServiceEmits } from '../services'
import { parsePaginationQuery } from '../helpers/pagination'

export interface ExampleControllerInterface {
  getPaginated: ControllerMethod
  getAll: ControllerMethod
  getOne: ControllerMethod
  create: ControllerMethod
  update: ControllerMethod
  delete: ControllerMethod
}

export class ExampleControllerInterface extends BaseController implements ExampleControllerInterface {
  private service = new ExampleService()

  private emitsOn = accessServiceEmits

  public getPaginated: ControllerMethod = async (req, res, next) => {
    try {
      const { query, options } = parsePaginationQuery(req.body, this.service.model)

      const response = await this.service.getPaginated(query, options)

      this.success(res, response)
    } catch (error) {
      this.criticalError(next, error)
    }
  }

  public getAll: ControllerMethod = async (req, res, next) => {
    try {
      const response = await this.service.getAll()

      this.success(res, response)
    } catch (error) {
      this.criticalError(next, error)
    }
  }

  public getOne: ControllerMethod = async (req, res, next) => {
    try {
      const response = await this.service.getOne({ _id: req.params.id })

      this.success(res, response)
    } catch (error) {
      this.criticalError(next, error)
    }
  }

  public create: ControllerMethod = async (req, res, next) => {
    try {
      const response = await this.service.create({ ...req.body })

      this.emitsOn.updatedAll()
      this.success(res, response)
    } catch (error) {
      this.criticalError(next, error)
    }
  }

  public update: ControllerMethod = async (req, res, next) => {
    try {
      const response = await this.service.update({ _id: req.params.id }, { ...req.body })

      this.emitsOn.updatedAll()
      this.success(res, response)
    } catch (error) {
      this.criticalError(next, error)
    }
  }

  public delete: ControllerMethod = async (req, res, next) => {
    try {
      const response = await this.service.delete({ _id: req.params.id })

      this.emitsOn.updatedAll()
      this.success(res, response)
    } catch (error) {
      this.criticalError(next, error)
    }
  }
}
```

There is a simple crud controller

```ts
import { ControllerMethod } from '../interfaces/controller'
import { api } from '../server'
import BaseController from './base/BaseController'

enum Emits {
  EVENT = 'EVENT',
}

export class NameController extends BaseController implements INameController {
  private model = NameModel

  public get: ControllerMethod = async (req, res, next) => {
    try {
      const documents = await this.model.find()

      this.success(res, documents)
    } catch (error) {
      this.criticalError(next, error)
    }
  }

  public getOne: ControllerMethod = async (req, res, next) => {
    const id = req.params.id

    try {
      const document = await this.model.findById(id)

      this.success(res, document)
    } catch (error) {
      this.criticalError(next, error)
    }
  }

  public create: ControllerMethod = async (req, res, next) => {
    const fields = req.body

    try {
      const document = await this.model.create(newRoleFields)

      api.io.emit(this.Emits.EVENT, document)
      api.io.emit(this.Emits.EVENT, 'value')

      this.success(res, document)
    } catch (error) {
      this.criticalError(next, error)
    }
  }

  public update: ControllerMethod = async (req, res, next) => {
    const id = req.params.id

    const fields = req.body

    try {
      const document = await this.model.findByIdAndUpdate(id, fields)

      api.io.emit(this.Emits.EVENT, document)
      api.io.emit(this.Emits.EVENT, 'value')

      this.success(res, document)
    } catch (error) {
      this.criticalError(next, error)
    }
  }

  public delete: ControllerMethod = async (req, res, next) => {
    const id = req.params.id

    try {
      const document = await this.model.findByIdAndDelete(id)

      api.io.emit(this.Emits.EVENT, document)
      api.io.emit(this.Emits.EVENT, 'value')

      this.success(res, document)
    } catch (error) {
      this.criticalError(next, error)
    }
  }
}
```
