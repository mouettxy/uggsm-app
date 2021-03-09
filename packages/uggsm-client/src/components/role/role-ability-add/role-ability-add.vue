<template lang="pug">
form(@submit.prevent='handleSubmit')
  v-row
    v-col(cols='4')
      ug-base-input(
        v-model='description',
        :hint='descriptionHint',
        label='Название способности'
      )
    v-col(cols='4')
      ug-base-select(
        v-model='type',
        :items='extendedTypes',
        label='Тип данных значения',
        item-value='value',
        item-text='text'
      )
    v-col(cols='4')
      ug-base-select(
        v-model='operator',
        :items='operators',
        label='Оператор сравнения значеня(-ий)',
        item-value='value',
        item-text='text'
      )
  v-row
    v-col(cols='4')
      ug-base-input(
        v-model='name',
        :hint='descriptionHint',
        label='Переменная способности'
      )
    v-col(cols='4')
      ug-base-autocomplete(
        v-model='autocomplete',
        :disabled='isChooseAutocompleteDisabled',
        label='Выберите автодополнение',
        item-value='value',
        item-text='text',
        hide-details,
        endpoint='/routes',
        disallow-free-type,
        dense
      )
    v-col(cols='4')
      v-slide-x-transition
        div(v-if='type === "accessList"')
          ug-select-many(
            v-model='value',
            :items='accessLinksList',
            label='Значение способности'
          )
        div(v-else-if='autocomplete && type === "array"')
          ug-tag-autocomplete(
            v-model='value',
            :path='`/${autocomplete}`',
            label='Значение способности'
          )
        div(v-else-if='!autocomplete && type === "array"')
          ug-tag-input(
            v-model='value',
            label='Значение способности'
          )
        div(v-else-if='autocomplete && type === "string"')
          ug-base-autocomplete(
            v-model='value',
            :endpoint='`/${autocomplete}`',
            item-value='value',
            item-text='text',
            hide-details,
            dense,
            abel='Значение способности'
          )
        div(v-else-if='!autocomplete && type === "string"')
          ug-base-input(
            v-model='value',
            label='Значение способности'
          )
        div(v-else-if='type === "boolean"')
          ug-base-switch.mt-1(
            v-model='value',
            label='Значение способности'
          )
  v-row(justify='end')
    v-col(cols='auto')
      ug-base-btn(
        :disabled='isAddAbilityDisabled',
        type='submit',
        label='Добавить способность',
        depressed,
        color='success'
      )
</template>

<script lang="ts">
import UgBaseAutocomplete from '@/components/base/ui/base-autocomplete/base-autocomplete.vue'
import UgBaseSelect from '@/components/base/ui/base-select/base-select.vue'
import UgSelectMany from '@/components/base/ui/select-many/select-many.vue'
import UgBaseSwitch from '@/components/base/ui/base-switch/base-switch.vue'

import RoleAPI from '@/api/role'
import { Role } from '@/typings/api/role'
import { cloneDeep } from 'lodash'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { normalizedMenus } from '@/api/helpers/menus'
import { Actions } from '@/typings/UggsmAbility'

enum Defaults {
  TYPE = 'boolean',
  OPERATOR = 'equals',
}

@Component({
  components: {
    UgBaseAutocomplete,
    UgBaseSelect,
    UgSelectMany,
    UgBaseSwitch,
  },
})
export default class UgRoleAbilityAdd extends Vue {
  @Prop({ required: true }) role!: Role

  public value: string | boolean | Array<string> | null = null

  public name: Actions = ''

  public description = ''

  public operator: string = Defaults.TYPE

  public type: string = Defaults.OPERATOR

  public autocomplete = ''

  public types: { text: string; value: string }[] = []

  public operators: { text: string; value: string }[] = []

  public accessLinksList = normalizedMenus

  public descriptionHint = `
  #### Рекомендации к заполнению

  - Название способности на русском, отображается в интерфейсе
  `

  public nameHint = `
  #### Рекомендации к заполнению

  - Название способности на английском, используется в коде
  - Не должно содержать пробелов
  `

  @Watch('type')
  onTypeChange(value: string) {
    if (value === 'string') {
      this.value = ''
      this.operator = 'equals'
    } else if (value === 'boolean') {
      this.value = false
      this.operator = 'equals'
    } else if (value === 'array') {
      this.value = []
      this.operator = 'in array'
    } else if (value === 'accessList') {
      this.value = []
      this.operator = 'in array'
    }
  }

  get extendedTypes() {
    return [
      ...this.types,
      {
        text: 'Список ссылок доступа',
        value: 'accessList',
      },
    ]
  }

  get isAddAbilityDisabled() {
    if (this.value !== null && this.name && this.description && this.operator && this.type) {
      return false
    }

    return true
  }

  get isChooseAutocompleteDisabled() {
    return !(this.type === 'array' || this.type === 'string')
  }

  clearModel() {
    this.type = Defaults.TYPE
    this.operator = Defaults.OPERATOR

    this.name = ''
    this.description = ''

    this.autocomplete = ''
    this.value = false
  }

  async getStatic(type: string) {
    const apiResponse = await RoleAPI.getStatic(type)

    return apiResponse.data
  }

  async handleSubmit() {
    if (this.isAddAbilityDisabled || this.value === null) {
      this.$notification.error('Не заполнено какое то из важных полей')
      return
    }

    const fields = cloneDeep({
      value: this.value,
      name: this.name,
      description: this.description,
      operator: this.operator,
      type: this.type,
      autocomplete: this.autocomplete,
    })

    // if field type is access list we change it to it's real type (array)
    // and make unique autocomplete endpoint
    // so other components can know what autocomplete needs to be rendered
    if (fields.type === 'accessList') {
      fields.type = 'array'
      fields.autocomplete = 'access-links-list'
    }

    const apiResponse = await RoleAPI.createAbility(this.role.value, fields)

    if (!(apiResponse.status === 200)) {
      this.$notification.error(`Ошибка сервера при создании способности ${this.description}`)
    }

    this.$notification.success(`Роль ${this.description} успешно создана`)

    this.clearModel()
  }

  async mounted() {
    this.types = await this.getStatic('types')
    this.operators = await this.getStatic('operators')

    this.type = Defaults.TYPE
    this.operator = Defaults.OPERATOR
  }
}
</script>

<style lang="sass"></style>
