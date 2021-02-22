# Interface Example

```ts
import { ControllerMethod } from './controller'

export type INameController = {
  get: ControllerMethod
  getOne: ControllerMethod
  create: ControllerMethod
  delete: ControllerMethod
  update: ControllerMethod
}
```
