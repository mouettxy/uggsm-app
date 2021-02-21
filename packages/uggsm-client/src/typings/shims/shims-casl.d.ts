import { UggsmAbility, Actions, Subjects } from './../UggsmAbility'

declare module 'vue/types/vue' {
  interface Vue {
    $ability: UggsmAbility
    $can(
      this: this,
      ...args: Parameters<(...args: [action: Actions] | [action: Actions, subject: Subjects, field?: any]) => boolean>
    ): boolean
  }
}
declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    ability?: UggsmAbility
  }
}
