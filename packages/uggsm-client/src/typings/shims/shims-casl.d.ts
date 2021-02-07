import { AppAbility } from './AppAbility'

declare module 'vue' {
  interface ComponentCustomProperties {
    $ability: AppAbility
    $can(this: this, ...args: any): boolean
  }
}
