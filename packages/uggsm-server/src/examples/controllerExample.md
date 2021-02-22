# Controller Example

There is a simple crud controller

```ts
import { ControllerMethod } from '../interfaces/controller'
import { api } from '../server'
import BaseController from './base/BaseController'

enum Emits {
  EVENT = "EVENT"
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
      api.io.emit(this.Emits.EVENT, "value")

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
      api.io.emit(this.Emits.EVENT, "value")

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
      api.io.emit(this.Emits.EVENT, "value")

      this.success(res, document)
    } catch (error) {
      this.criticalError(next, error)
    }
  }
}
```
