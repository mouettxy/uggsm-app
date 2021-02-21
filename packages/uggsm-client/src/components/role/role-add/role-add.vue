<template lang="pug">
form(@submit.prevent='handleSubmit')
  v-row
    v-col(cols='5')
      ug-base-input(
        v-model='name',
        :rules='validators.name',
        :hint='nameHint',
        label='Название роли'
      )
    v-col(cols='5')
      ug-base-input(
        v-model='value',
        :rules='validators.value',
        :hint='valueHint',
        label='Переменная роли'
      )
    v-col(cols='2')
      v-btn(
        type='submit',
        height='40',
        depressed,
        color='primary',
        block
      )
        v-icon(left) mdi-content-save
        span Добавить
  v-row
    v-col(cols='12')
      v-textarea(
        v-model='description',
        outlined,
        label='Опциональный комментарий описывающий роль в системе',
        hide-details,
        height='2'
      )
</template>

<script lang="ts">
import RoleAPI from '@/api/role'
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class UgRoleAdd extends Vue {
  public value = ''
  public name = ''
  public description = ''

  public showForm = false

  public nameHint = `
  #### Рекомендации к заполнению
  
  - Должно быть написано на русском, отображается в интерфейсе
  - Должно отражать краткое значение роли в системе
  `
  public valueHint = `
  #### Рекомендации к заполнению

  - Должно быть написано на английском, используется в коде
  `

  public validators = {
    name: [(v: any) => (v || '').length > 0 || 'Обязательное поле для заполнения'],
    value: [(v: any) => (v || '').length > 0 || 'Обязательное поле для заполнения'],
  }

  clearModel() {
    this.value = ''
    this.name = ''
    this.description = ''
  }

  async handleSubmit() {
    const apiResponse = await RoleAPI.create({
      value: this.value,
      name: this.name,
      description: this.description,
    })

    if (!(apiResponse.status === 200)) {
      this.$notification.error(`Произошла ошибка при создании роли ${this.name} <${this.value}>`)
      return
    }

    this.$notification.success(`Роль ${this.name} <${this.value}> успешно создана`)

    this.clearModel()
    this.$emit('deactivate')
  }
}
</script>

<style lang="sass"></style>
